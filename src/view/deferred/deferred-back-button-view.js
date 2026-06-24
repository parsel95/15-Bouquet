import AbstractView from '../../framework/view/abstract-view.js';

const createDeferredBackButtonTemplate = () =>
  `
    <a class="btn btn--with-icon popup-deferred__btn btn--light" href="#">в&nbsp;каталог
      <svg width="61" height="24" aria-hidden="true">
        <use xlink:href="#icon-arrow"></use>
      </svg>
    </a>
  `;

export default class DeferredBackButtonView extends AbstractView {
  get template() {
    return createDeferredBackButtonTemplate();
  }

  setClickHandler = (callback) => {
    this._callback.click = callback;

    this.element.addEventListener('click', this.#clickHandler);
  }

  #clickHandler = (evt) => {
    evt.preventDefault();
    this._callback.click();
  }
}
