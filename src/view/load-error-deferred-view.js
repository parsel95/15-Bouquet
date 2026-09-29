import AbstractView from '../framework/view/abstract-view.js';

const createLoadErrorDeferredTemplate = () => `
  <div class="load-error-deferred" role="alertdialog" aria-modal="true">
    <div class="load-error-deferred__content">
      <p class="load-error-deferred__title">
        Упс, что-то пошло не так
      </p>

      <p class="load-error-deferred__text">
        Не удалось загрузить отложенные. Попробуйте ещё раз.
      </p>

      <button
        class="btn load-error-deferred__button"
        type="button"
      >
        попробовать снова
      </button>
    </div>
  </div>
`;

export default class LoadErrorDeferredView extends AbstractView {
  get template() {
    return createLoadErrorDeferredTemplate();
  }

  setText = (text) => {
    this.element.querySelector('.load-error-deferred__text').textContent = text;
  }

  setClickHandler = (callback) => {
    this._callback.click = callback;
    this.element.querySelector('.load-error-deferred__button').addEventListener('click', this.#clickHandler);
  }

  removeClickHandler = () => {
    this.element.querySelector('.load-error-deferred__button').removeEventListener('click', this.#clickHandler);
  }

  #clickHandler = (evt) => {
    evt.preventDefault();
    this._callback.click();
  }
}
