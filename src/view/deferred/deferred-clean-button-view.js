import AbstractView from '../../framework/view/abstract-view.js';

const createDeferredCleanButtonTemplate = () =>
  `
    <button class="btn btn--with-icon popup-deferred__btn-clean" type="button">
      <span class="popup-deferred__btn-clean-text">очистить</span>
      <svg width="61" height="24" aria-hidden="true">
        <use xlink:href="#icon-arrow"></use>
      </svg>
    </button>
  `;

export default class DeferredCleanButtonView extends AbstractView {
  #isCleaning = false;

  get template() {
    return createDeferredCleanButtonTemplate();
  }

  // eslint-disable-next-line accessor-pairs
  set buttonText(isCleaning) {
    this.#isCleaning = isCleaning;
    this.#changeButtonText();
  }

  #changeButtonText() {
    this.element.querySelector('.popup-deferred__btn-clean-text').textContent =
      this.#isCleaning ? 'очищаем...' : 'очистить';
  }

  setClickHandler = (callback) => {
    this._callback.click = callback;

    this.element.addEventListener('click', this.#clickHandler);
  };

  #clickHandler = (evt) => {
    evt.preventDefault();
    this._callback.click();
  };
}
