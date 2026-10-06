import Observable from '../framework/observable.js';
import {UpdateType, ErrorType, ErrorThrowMessage} from '../const.js';

/**
 * Создаёт пустое состояние списка отложенных букетов.
 */
const createEmptyDeferred = () => ({
  products: {},
  productCount: 0,
  sum: 0,
});

/**
 * Управляет состоянием списка отложенных букетов.
 *
 * Отвечает за:
 * - загрузку состояния с сервера;
 * - добавление и удаление экземпляров букетов;
 * - изменение локального состояния;
 * - оптимистичные обновления;
 * - откат локального изменения при ошибке запроса;
 * - синхронизацию с сервером после частичных сбоев.
 *
 * Наследуется от Observable и уведомляет подписчиков
 * об изменениях состояния.
 */
export default class DeferredModel extends Observable {
  #deferred = createEmptyDeferred();
  #apiService = null;
  #isLoaded = false;
  #isLoadError = false;

  constructor(apiService) {
    super();
    this.#apiService = apiService;
  }

  /**
   * Загружает состояние отложенных с сервера.
   *
   * Пустой ответ API преобразуется в единый формат пустого состояния.
   * При ошибке сохраняется пустое состояние и устанавливается
   * признак ошибки загрузки.
   */
  init = async () => {
    this.#isLoadError = false;

    try {
      this.#deferred = this.#normalizeDeferred(
        await this.#apiService.get()
      );
    } catch {
      this.#deferred = createEmptyDeferred();
      this.#isLoadError = true;
      this._notify(UpdateType.ERROR_LOAD_DEFERRED);
    }

    this.#isLoaded = true;
    this._notify(UpdateType.INIT);
    this._notify(UpdateType.MINOR);
  };

  /**
   * Получает актуальное состояние отложенных непосредственно с сервера.
   *
   * Используется для синхронизации локального состояния после
   * частичного сбоя нескольких серверных операций.
   */
  getActualDeferred = async () => this.#normalizeDeferred(await this.#apiService.get());

  /**
   * Возвращает текущее локальное состояние отложенных.
   */
  get = () => this.#deferred;

  /**
   * Возвращает признак завершения первоначальной загрузки.
   */
  getIsLoaded = () => this.#isLoaded;

  /**
   * Возвращает признак ошибки первоначальной загрузки отложенных.
   */
  getIsLoadError = () => this.#isLoadError;

  /**
   * Проверяет наличие букета в списке отложенных.
   *
   * @param {number|string} bouquetId Идентификатор букета.
   * @returns {boolean} true, если букет находится в отложенных.
   */
  has = (bouquetId) => Object.hasOwn(this.#deferred.products, bouquetId);

  /**
   * Приводит ответ API к единому формату состояния отложенных.
   *
   * Сервер может вернуть пустой объект вместо объекта с полями
   * products, productCount и sum.
   */
  #normalizeDeferred(deferred) {
    return Object.keys(deferred).length === 0
      ? createEmptyDeferred()
      : deferred;
  }

  /**
   * Увеличивает общее количество экземпляров и сумму отложенных.
   *
   * @param {number} price Цена одного экземпляра букета.
   */
  #increaseTotals(price) {
    this.#deferred.productCount++;
    this.#deferred.sum += price;
  }

  /**
   * Уменьшает общее количество экземпляров и сумму отложенных.
   *
   * @param {number} price Цена одного экземпляра букета.
   */
  #decreaseTotals(price) {
    this.#deferred.productCount--;
    this.#deferred.sum -= price;
  }

  /**
   * Добавляет один экземпляр букета и обновляет общие итоги.
   */
  #increment(updateType, bouquet) {
    if (this.#deferred.products[bouquet.id]) {
      this.#deferred.products[bouquet.id]++;
    } else {
      this.#deferred.products[bouquet.id] = 1;
    }

    this.#increaseTotals(bouquet.price);
    this._notify(updateType, bouquet);
  }

  /**
   * Удаляет один экземпляр букета и обновляет общие итоги.
   */
  #decrement(updateType, bouquet) {
    if (this.#deferred.products[bouquet.id] > 1) {
      this.#deferred.products[bouquet.id]--;
    } else {
      delete this.#deferred.products[bouquet.id];
    }

    this.#decreaseTotals(bouquet.price);
    this._notify(updateType, bouquet);
  }

  /**
   * Оптимистично добавляет букет в отложенные и отправляет
   * соответствующий запрос на сервер.
   *
   * При ошибке запроса локальное изменение откатывается,
   * после чего ошибка передаётся вызывающему коду.
   */
  add = async (updateType, bouquet) => {
    this.#increment(updateType, bouquet);

    try {
      await this.#apiService.add(bouquet);
    } catch {
      this.#decrement(updateType, bouquet);

      throw this.#createError(ErrorThrowMessage.ADD_DEFERRED, ErrorType.ADD_DEFERRED);
    }
  };

  /**
   * Оптимистично удаляет один экземпляр букета из отложенных
   * и отправляет соответствующий запрос на сервер.
   *
   * При ошибке запроса локальное изменение откатывается.
   */
  delete = async (updateType, bouquet) => {
    this.#decrement(updateType, bouquet);

    try {
      await this.#apiService.delete(bouquet.id);
    } catch {
      this.#increment(updateType, bouquet);

      throw this.#createError(ErrorThrowMessage.DELETE_DEFERRED, ErrorType.DELETE_DEFERRED);
    }
  };

  /**
   * Удаляет все экземпляры всех букетов из отложенных.
   *
   * Запросы выполняются через Promise.allSettled(), поскольку
   * отдельные удаления могут завершиться с разными результатами.
   *
   * При частичном сбое локальное состояние не откатывается вручную.
   * Вместо этого оно повторно загружается с сервера для синхронизации.
   */
  cleanAll = async (updateType) => {
    const bouquetIds = Object.keys(this.#deferred.products);

    const results = await Promise.allSettled(
      bouquetIds.map(async (bouquetId) => {
        const quantity = this.#deferred.products[bouquetId];

        for (let i = 0; i < quantity; i++) {
          await this.#apiService.delete(bouquetId);
        }
      })
    );

    const hasError = results.some(
      (result) => result.status === 'rejected'
    );

    if (!hasError) {
      this.#deferred = createEmptyDeferred();
      this._notify(updateType);
      return;
    }

    await this.#syncDeferred(updateType);

    throw this.#createError(ErrorThrowMessage.CLEAN_ALL_DEFERRED, ErrorType.CLEAN_ALL_DEFERRED);
  };

  /**
   * Полностью удаляет один букет из списка отложенных
   * вместе со всеми его экземплярами.
   *
   * При частичном сбое запросов состояние синхронизируется
   * с сервером через getActualDeferred().
   */
  deleteCard = async (updateType, bouquet) => {
    const savedCount = this.#deferred.products[bouquet.id];
    const savedPrice = bouquet.price * savedCount;
    const deleteRequests = [];

    this.#deferred.productCount -= savedCount;
    this.#deferred.sum -= savedPrice;

    delete this.#deferred.products[bouquet.id];

    this._notify(updateType, bouquet);

    for (let i = 0; i < savedCount; i++) {
      deleteRequests.push(
        this.#apiService.delete(bouquet.id)
      );
    }

    const results = await Promise.allSettled(deleteRequests);
    const hasError = results.some(
      (result) => result.status === 'rejected'
    );

    if (!hasError) {
      return;
    }

    await this.#syncDeferred(updateType);

    throw this.#createError(ErrorThrowMessage.CLEAN_CARD_DEFERRED, ErrorType.CLEAN_CARD_DEFERRED);
  };

  /**
   * Переключает наличие букета в отложенных.
   *
   * Если букет отсутствует, добавляет один экземпляр.
   * Если сохранён один экземпляр, удаляет его.
   * Если сохранено несколько экземпляров, полностью удаляет букет
   * вместе со всеми его экземплярами.
   */
  toggleDeferred = (updateType, bouquet) => {
    if (this.has(bouquet.id)) {
      if (this.#deferred.products[bouquet.id] > 1) {
        return this.deleteCard(updateType, bouquet);
      } else {
        return this.delete(updateType, bouquet);
      }
    }

    return this.add(updateType, bouquet);
  };

  #syncDeferred = async (updateType) => {
    try {
      const actualDeferred = await this.getActualDeferred();

      this.#deferred = actualDeferred;
      this._notify(updateType);
    } catch {
      throw this.#createError(ErrorThrowMessage.SYNC_DEFERRED, ErrorType.SYNC_DEFERRED);
    }
  };

  #createError(message, type) {
    const error = new Error(message);
    error.type = type;
    return error;
  }
}
