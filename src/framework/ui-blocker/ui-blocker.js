import AbstractView from '../../framework/view/abstract-view';
import './ui-blocker.css';

const createUiBlockerTemplate = () => `<div class="ui-blocker"></div>`;

/**
 * Класс для блокировки интерфейса
 */
export default class UiBlocker extends AbstractView {
  /** @type {number} Время до блокировки интерфейса в миллисекундах */
  #lowerLimit;

  /** @type {number} Минимальное время блокировки интерфейса в миллисекундах */
  #upperLimit;

  /** @type {number} Время вызова метода block */
  #startTime;

  /** @type {number} Время вызова метода unblock */
  #endTime;

  /** @type {number} Идентификатор таймера */
  #timerId;

  /** @type {boolean} Флаг, указывающий, нужно ли показывать визуальный индикатор загрузки */
  #showLoader;

  /**
   * @param {Object} config Объект с настройками блокировщика
   * @param {number} config.lowerLimit Время до отображения визуального индикатора загрузки. Сам интерфейс блокируется сразу.
   * @param {number} config.upperLimit Минимальное время блокировки в миллисекундах. Минимальная длительность блокировки
   */
  constructor({lowerLimit, upperLimit, showLoader = true}) {
    super();

    this.#lowerLimit = lowerLimit;
    this.#upperLimit = upperLimit;
    this.#showLoader = showLoader;
  }

  get template() {
    return createUiBlockerTemplate();
  }

  /** Метод для блокировки интерфейса */
  block() {
    this.#addClass('ui-blocker-blocked');
    this.#startTime = Date.now();

    if (!this.#showLoader) {
      return;
    }

    this.#timerId = setTimeout(() => {
      this.#addClass('ui-blocker--loading');
    }, this.#lowerLimit);
  }

  /** Метод для разблокировки интерфейса */
  unblock() {
    this.#endTime = Date.now();
    const duration = this.#endTime - this.#startTime;

    if (!this.#showLoader) {
      this.#removeClass('ui-blocker-blocked');
      return;
    }

    if (duration < this.#lowerLimit) {
      clearTimeout(this.#timerId);
      this.#removeClass('ui-blocker-blocked');
      return;
    }

    if (duration >= this.#upperLimit) {
      this.#removeClass('ui-blocker--loading');
      this.#removeClass('ui-blocker-blocked');
      return;
    }

    setTimeout(() => {
      this.#removeClass('ui-blocker--loading');
      this.#removeClass('ui-blocker-blocked');
    }, this.#upperLimit - duration);
  }

  /** Метод, добавляющий CSS-класс элементу */
  #addClass = (className) => {
    this.element.classList.add(className);
  };

  /** Метод, убирающий CSS-класс с элемента */
  #removeClass = (className) => {
    this.element.classList.remove(className);
  };
}
