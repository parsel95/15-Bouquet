import './ui-blocker.css';

/**
 * Класс для блокировки интерфейса
 */
export default class UiBlocker {
  /** @type {number} Время до блокировки интерфейса в миллисекундах */
  #lowerLimit;

  /** @type {number} Минимальное время блокировки интерфейса в миллисекундах */
  #upperLimit;

  /** @type {HTMLElement|null} Элемент, блокирующий интерфейс */
  #element;

  /** @type {number} Время вызова метода block */
  #startTime;

  /** @type {number} Время вызова метода unblock */
  #endTime;

  /** @type {number} Идентификатор таймера */
  #timerId;

  /**
   * @param {Object} config Объект с настройками блокировщика
   * @param {number} config.lowerLimit Время до отображения визуального индикатора загрузки. Сам интерфейс блокируется сразу.
   * @param {number} config.upperLimit Минимальное время блокировки в миллисекундах. Минимальная длительность блокировки
   */
  constructor({lowerLimit, upperLimit}) {
    this.#lowerLimit = lowerLimit;
    this.#upperLimit = upperLimit;

    this.#element = document.createElement('div');
    this.#element.classList.add('ui-blocker');
    document.querySelector('.wrapper').append(this.#element);
  }

  /** Метод для блокировки интерфейса */
  block() {
    this.#addClass('ui-blocker-blocked');
    this.#startTime = Date.now();
    this.#timerId = setTimeout(() => {
      this.#addClass('ui-blocker--loading');
    }, this.#lowerLimit);
  }

  /** Метод для разблокировки интерфейса */
  unblock() {
    this.#endTime = Date.now();
    const duration = this.#endTime - this.#startTime;

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
    this.#element.classList.add(className);
  };

  /** Метод, убирающий CSS-класс с элемента */
  #removeClass = (className) => {
    this.#element.classList.remove(className);
  };
}
