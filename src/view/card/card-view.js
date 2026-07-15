import AbstractView from '../../framework/view/abstract-view.js';
import {createCardButtonHeartTemplate} from './card-button-heart-template.js';
import {LabelType} from '../../const.js';

const createCardViewTemplate = ({title, description, type, price, previewImage}, isDeferred) => {
  const getLabelText = (type) => {
    return LabelType[type] || '';
  }

  const getFavoriteClass = (isDeferred) => isDeferred ? 'is-favorite' : '';

  return `
    <li class="catalogue__item">
      <div class="item-card ${getFavoriteClass(isDeferred)}">
        <button
          class="item-card__btn"
          type="button"
          data-open-modal="product-card"
          aria-label="посмотреть товар">
        </button>

        <p class="item-card__label">${getLabelText(type)}</p>

        <div class="item-card__img-wrap">
          ${createCardButtonHeartTemplate()}

          <img src="${previewImage}" alt="${title}">
        </div>

        <div class="item-card__desc-wrap">
          <h3 class="title title--h4 item-card__title">${title}</h3>
          <div class="item-card__price-wrap">
            <b class="item-card__formatted-price">${price}</b>
            <span class="item-card__currency">р</span>
          </div>
        </div>

        <p class="text text--size-20 item-card__desc">${description}</p>
      </div>
    </li>
  `;
}

export default class CardView extends AbstractView {
  #bouquet = null;
  #isDeferred = false;

  constructor(bouquet, isDeferred) {
    super();
    this.#bouquet = bouquet;
    this.#isDeferred = isDeferred;
  }

  get template() {
    return createCardViewTemplate(this.#bouquet, this.#isDeferred);
  }

  setOpenClickHandler = (callback) => {
    this._callback.click = callback;
    this.element.querySelector('.item-card__btn').addEventListener('click', this.#openClickHandler);
  }

  setToggleDeferredClickHandler = (callback) => {
    this._callback.toggleDeferred = callback;
    this.element.querySelector('.button-heart').addEventListener('click', this.#toggleDeferredClickHandler);
  }

  #openClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.click();
  }

  #toggleDeferredClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.toggleDeferred();
  }
}
