import AbstractView from '../framework/view/abstract-view.js';

const createErrorModalTemplate = () => `
  <div class="error-modal" role="alertdialog" aria-modal="true">
    <div class="error-modal__content">
      <p class="error-modal__title">Упс, что-то пошло не так</p>

      <p class="error-modal__text">
        Не удалось изменить отложенные. Попробуйте ещё раз.
      </p>

      <button
        class="btn error-modal__button"
        type="button"
      >
        хорошо
      </button>
    </div>
  </div>
`;

export default class ErrorModalView extends AbstractView {
  get template() {
    return createErrorModalTemplate();
  }

  setClickHandler = (callback) => {
    this._callback.click = callback;
    this.element.querySelector('.error-modal__button').addEventListener('click', this.#clickHandler);
  }

  removeClickHandler = () => {
    this.element.querySelector('.error-modal__button').removeEventListener('click', this.#clickHandler);
  }

  #clickHandler = (evt) => {
    evt.preventDefault();
    this._callback.click();
  }
}
