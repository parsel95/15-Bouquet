import AbstractView from '../../framework/view/abstract-view.js';

const createCatalogueButtonMoreViewTemplate = () =>
  `<button class="btn btn--outlined catalogue__show-more-btn" type="button">
      больше букетов
  </button>`;

export default class CatalogueButtonMoreView extends AbstractView {
  get template() {
    return createCatalogueButtonMoreViewTemplate();
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
