import AbstractView from '../../framework/view/abstract-view.js';

const createLoadMoreButtonViewTemplate = () =>
  `<button class="btn btn--outlined catalogue__show-more-btn" type="button">
      больше букетов
  </button>`;

export default class LoadMoreButtonView extends AbstractView {
  get template() {
    return createLoadMoreButtonViewTemplate();
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
