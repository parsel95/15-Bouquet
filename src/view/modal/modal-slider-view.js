import AbstractView from '../../framework/view/abstract-view.js';
import { createModalSliderImgTemplate } from './modal-slider-img-template.js';

const createModalSliderViewTemplate = ({authorPhoto, images}) => {
  const pictures = images.map((picture, index) =>
    createModalSliderImgTemplate(picture, authorPhoto, index)).join('');
  return `
      <div class="image-slider swiper modal-product__slider">
        <div class="image-slides-list swiper-wrapper">
          ${pictures}
        </div>

        <button
          class="btn-round btn-round--to-left image-slider__button image-slider__button--prev"
          type="button"
          aria-label="Предыдущий слайд"
        >
          <svg width="80" height="85" aria-hidden="true" focusable="false">
            <use xlink:href="#icon-round-button"></use>
          </svg>
        </button>

        <button
          class="btn-round btn-round--to-right image-slider__button image-slider__button--next"
          type="button"
          aria-label="Следующий слайд"
        >
          <svg width="80" height="85" aria-hidden="true" focusable="false">
            <use xlink:href="#icon-round-button"></use>
          </svg>
        </button>
      </div>
    `
  ;
};


 export default class ModalSliderView extends AbstractView {
  #bouquet = null;

  constructor(bouquet) {
    super();
    this.#bouquet = bouquet;
  }

  get template() {
    return createModalSliderViewTemplate(this.#bouquet);
  }
 }

