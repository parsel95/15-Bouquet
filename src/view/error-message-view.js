import AbstractView from '../framework/view/abstract-view.js';

const createErrorMessageTemplate = () =>
  `
    <div class="bouquet-error-toast">
      <p>Не удалось изменить отложенные. Попробуйте ещё раз.</p>
    </div>
  `;

export default class ErrorMessageView extends AbstractView {
  #timerId = null;

  get template() {
    return createErrorMessageTemplate();
  }

  show(message = 'Не удалось изменить отложенные. Попробуйте ещё раз.') {
    clearTimeout(this.#timerId);

    this.element.querySelector('p').textContent = message;
    this.element.classList.add('bouquet-error-toast--visible');

    this.#timerId = setTimeout(() => {
      this.element.classList.remove('bouquet-error-toast--visible');
    }, 3000);
  }
}
