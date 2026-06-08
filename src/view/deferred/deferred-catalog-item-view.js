import AbstractView from '../../framework/view/abstract-view.js';

const createDeferredCatalogItemTemplate = ({title, description, price, previewImage}, count) =>
  `
    <li class="popup-deferred__item">
      <div class="deferred-card">
        <div class="deferred-card__img">
          <img src="${previewImage}" alt="${title}">
        </div>

        <div class="deferred-card__content">
          <h2 class="title title--h2">${title}</h2>
          <p class="text text--size-40">${description}</p>
        </div>

        <div class="deferred-card__count">
          <button class="btn-calculate" type="button">
            <svg width="30" height="27" aria-hidden="true">
              <use xlink:href="#icon-minus"></use>
            </svg>

          </button><span>${count}</span>

          <button class="btn-calculate" type="button">
            <svg width="30" height="28" aria-hidden="true">
              <use xlink:href="#icon-cross"></use>
            </svg>
          </button>
        </div>

        <div class="deferred-card__price">
          <b class="price price--size-middle-p">${price}<span>Р</span></b>
        </div>

        <button class="btn-close deferred-card__close-btn" type="button">
          <svg width="55" height="56" aria-hidden="true">
            <use xlink:href="#icon-close-big"></use>
          </svg>
        </button>

        <svg class="deferred-card__close-btn deferred-card__loader" width="56" height="56" aria-hidden="true">
          <use xlink:href="#icon-loader"></use>
        </svg>
      </div>
    </li>
  `;

export default class DeferredCatalogItemView extends AbstractView {
  #bouquet = null;
  #count = null;

  constructor(bouquet, count) {
    super();
    this.#bouquet = bouquet;
    this.#count = count;
  }

  get template() {
    return createDeferredCatalogItemTemplate(this.#bouquet, this.#count);
  }
}
