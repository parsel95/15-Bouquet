import AbstractView from '../../framework/view/abstract-view.js';

const createModalViewTemplate = ({title, description, price}) =>
  `
    <div class="modal modal--product product-card-active is-active" data-modal="product-card">
      <div class="modal__wrapper">
        <div class="modal__overlay" data-close-modal=""></div>

        <div class="modal__content">
          <div class="modal-product">
            <button
              class="btn-close modal-product__btn-close"
              type="button" data-close-modal=""
              aria-label="Закрыть"
            >
              <svg width="55" height="56" aria-hidden="true">
                <use xlink:href="#icon-close-big"></use>
              </svg>
            </button>

            <svg class="modal-product__btn-close modal-product__loader" width="56" height="56" aria-hidden="true">
              <use xlink:href="#icon-loader"></use>
            </svg>

            <div class="product-description">
              <div class="product-description__header">
                <h3 class="title title--h2">${title}</h3>
                <b class="price price--size-big">
                  ${price}
                  <span>Р</span>
                </b>
              </div>

              <p class="text text--size-40">${description}</p>

              <button class="btn btn--outlined btn--full-width product-description__button" type="button" data-focus="">отложить
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
 `;

export default class ModalView extends AbstractView {
  #bouquet = null;

  constructor(bouquet) {
    super();
    this.#bouquet = bouquet;
  }

  get template() {
    return createModalViewTemplate(this.#bouquet);
  }

  get descriptionContainer() {
    return this.element.querySelector('.product-description');
  }

  setCloseClickHandler = (callback) => {
    this._callback.click = callback;

    this.element.querySelector('.modal-product__btn-close').addEventListener('click', this.#closeClickHandler);
  }

  #closeClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.click();
  }
}
