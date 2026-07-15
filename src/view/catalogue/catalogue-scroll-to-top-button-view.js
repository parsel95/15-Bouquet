import AbstractView from '../../framework/view/abstract-view.js';

const createScrollToTopButtonViewTemplate = () =>
  `
    <button
      class="btn-round btn-round--to-top btn-round--size-small catalogue__to-top-btn"
      type="button"
      aria-label="наверх"
    >
      <svg width="80" height="85" aria-hidden="true" focusable="false">
        <use xlink:href="#icon-round-button"></use>
      </svg>
    </button>
  `;

export default class ScrollToTopButtonView extends AbstractView {
  get template() {
    return createScrollToTopButtonViewTemplate();
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
