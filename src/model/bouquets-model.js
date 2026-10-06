import Observable from '../framework/observable';
import {UpdateType} from '../const.js';

/**
 * Хранит и предоставляет данные каталога букетов.
 *
 * Отвечает за загрузку каталога через API-сервис, хранение состояния
 * загрузки и адаптацию полученных данных к формату клиентского приложения.
 *
 * Наследуется от Observable и уведомляет подписчиков о начале и завершении
 * загрузки каталога.
 */
export default class BouquetsModel extends Observable {
  #bouquets = [];
  #apiService = null;
  #isLoaded = false;
  #isLoadError = false;

  constructor(apiService) {
    super();
    this.#apiService = apiService;
  }

  /**
   * Загружает каталог букетов с сервера.
   *
   * Перед началом загрузки отправляет событие LOADING.
   * После успешной загрузки адаптирует данные к клиентскому формату.
   * При ошибке сохраняет пустой каталог и устанавливает признак ошибки.
   */
  init = async () => {
    this.#isLoaded = false;
    this.#isLoadError = false;

    this._notify(UpdateType.LOADING);

    try {
      const bouquets = await this.#apiService.get();

      this.#bouquets = bouquets.map(this.#adaptToClient);
      this.#isLoadError = false;
    } catch {
      this.#bouquets = [];
      this.#isLoadError = true;
    }

    this.#isLoaded = true;
    this._notify(UpdateType.INIT);
  };

  /**
   * Возвращает текущий каталог букетов.
   */
  get = () => this.#bouquets;

  getIsLoaded = () => this.#isLoaded;

  /**
   * Возвращает признак ошибки последней загрузки каталога.
   */
  getIsLoadError = () => this.#isLoadError;

  /**
   * Запрашивает данные конкретного букета через API-сервис.
   *
   * @param {number|string} id Идентификатор букета.
   * @returns {Promise<Object>} Данные букета.
   */
  getById = (id) => this.#apiService.getById(id);

  #adaptToClient = (bouquet) => ({
    ...bouquet,
    type: this.#adaptType(bouquet.type),
    color: this.#adaptColor(bouquet.color),
  });

  #adaptType = (type) => {
    switch (type) {
      case 'birthdayboy':
        return 'birthday';
      case 'forlove':
        return 'darling';
      case 'bridge':
        return 'bride';
      case 'colleagues':
        return 'colleague';
      case 'motherday':
        return 'mother';
      default:
        return type;
    }
  };

  #adaptColor = (color) => {
    if (color === 'violet') {
      return 'lilac';
    } else {
      return color;
    }
  };
}
