import AbstractView from '../../framework/view/abstract-view.js';

const createCatalogueReloadButtonTemplate = () =>
  `
    <button class="btn btn--outlined-2 error-message__button" type="button">
      попробовать снова
    </button>
  `;

export default class CatalogueReloadButtonView extends AbstractView {
  get template() {
    return createCatalogueReloadButtonTemplate();
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
