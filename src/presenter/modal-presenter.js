import ModalView from '../view/modal/modal-view.js';
import ModalSliderView from '../view/modal/modal-slider-view.js';

import {render, RenderPosition, remove} from '../framework/render.js';

export default class ModalPresenter {
  #container = null;

  #modalViewComponent = null;
  #modalSliderViewComponent = null;

  #bouquet = null;

  constructor(container) {
    this.#container = container;
  }

  setCloseClickHandler(handler) {
    this.#modalViewComponent.setCloseClickHandler(handler);
  }

  init = (bouquet) => {
    this.#bouquet = bouquet;

    this.#modalViewComponent = new ModalView(this.#bouquet);
    this.#modalSliderViewComponent = new ModalSliderView(this.#bouquet);

    render(this.#modalViewComponent, this.#container);
    render(this.#modalSliderViewComponent, this.#modalViewComponent.descriptionContainer, RenderPosition.BEFOREBEGIN);
    this.#modalSliderViewComponent.init();
  }

  destroy() {
    remove(this.#modalViewComponent);
  }
}
