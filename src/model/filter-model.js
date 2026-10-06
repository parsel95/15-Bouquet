import Observable from '../framework/observable.js';
import {ReasonType, ColorType} from '../const.js';

/**
 * Хранит состояние фильтров каталога.
 *
 * Управляет выбранным фильтром по причине и набором
 * выбранных цветовых фильтров.
 *
 * Наследуется от Observable и уведомляет подписчиков
 * об изменении выбранных фильтров.
 */
export default class FilterModel extends Observable {
  #reasonFilter = ReasonType.ALL;
  #colorFilters = [ColorType.ALL];

  /**
   * Возвращает выбранный фильтр по причине.
   */
  get reasonFilter() {
    return this.#reasonFilter;
  }

  /**
   * Возвращает копию массива выбранных цветовых фильтров.
   */
  get colorFilters() {
    return [...this.#colorFilters];
  }

  /**
   * Сбрасывает фильтры до значений по умолчанию.
   *
   * Метод изменяет состояние модели без отправки уведомления.
   */
  resetFilters = () => {
    this.#reasonFilter = ReasonType.ALL;
    this.#colorFilters = [ColorType.ALL];
  };

  /**
   * Устанавливает фильтр по причине и уведомляет подписчиков
   * об изменении состояния.
   *
   * @param {string} updateType Тип обновления для Observable.
   * @param {string} reasonFilter Новое значение фильтра.
   */
  setReasonFilter = (updateType, reasonFilter) => {
    if (this.#reasonFilter === reasonFilter) {
      return;
    }

    this.#reasonFilter = reasonFilter;
    this._notify(updateType, reasonFilter);
  };

  #addColorFilter = (colorFilter) => {
    this.#colorFilters.push(colorFilter);
  };

  #deleteColorFilter = (colorFilter) => {
    this.#colorFilters = this.#colorFilters.filter((filter) => filter !== colorFilter);
  };

  /**
   * Переключает цветовой фильтр.
   *
   * Фильтр ALL является взаимоисключающим с конкретными цветами:
   * при выборе конкретного цвета ALL удаляется,
   * а при выборе ALL остальные цвета заменяются на ALL.
   *
   * @param {string} updateType Тип обновления для Observable.
   * @param {string} colorFilter Цветовой фильтр.
   */
  toggleColorFilter = (updateType, colorFilter) => {
    if (colorFilter === ColorType.ALL) {
      if (!this.#colorFilters.includes(ColorType.ALL)) {
        this.#colorFilters = [ColorType.ALL];
      } else {
        return;
      }

      this._notify(updateType, colorFilter);
      return;
    }

    if (this.#colorFilters.includes(ColorType.ALL)) {
      this.#deleteColorFilter(ColorType.ALL);
    }

    this.#toggleColorInSelection(colorFilter);
    this._notify(updateType, colorFilter);
  };

  #toggleColorInSelection = (colorFilter) => {
    if (!this.#colorFilters.includes(colorFilter)) {
      this.#addColorFilter(colorFilter);
    } else {
      this.#deleteColorFilter(colorFilter);
    }

    if (this.#colorFilters.length === 0) {
      this.#addColorFilter(ColorType.ALL);
    }
  };
}
