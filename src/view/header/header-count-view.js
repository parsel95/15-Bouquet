import AbstractView from '../../framework/view/abstract-view.js';

const createHeaderCountViewTemplate = ({productCount, sum}) =>
  `
    <div class="header-count">
      <button class="header-count__btn" type="button">
        <svg width="60" height="47" aria-hidden="true">
          <use xlink:href="#icon-heart-header"></use>
        </svg>
        <span class="visually-hidden">закрыть</span>
      </button>
      <div class="header-count__count">
        <p class="text text--size-20 header-count__counter">${productCount}</p>
      </div>
      <div class="header-count__block">
        <p class="text text--size-20 header-count__text">сумма</p>
        <b class="price price--size-min header-count__price">
          ${sum}
          <span>Р</span>
        </b>
      </div>
    </div>
  `;

export default class HeaderCountView extends AbstractView {
  #deferred = null;

  constructor(deferred) {
    super();
    this.#deferred = deferred;
  }

  get template() {
    return createHeaderCountViewTemplate(this.#deferred);
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
