import ModalView from '../view/modal/modal-view.js';
import ModalSliderView from '../view/modal/modal-slider-view.js';

import {render, RenderPosition, remove, replace} from '../framework/render.js';

export default class ModalPresenter {
  #modalComponent = null;
  #modalSliderComponent = null;

  #container = null;
  #deferredModel = null;

  #bouquet = null;

  #changeData = null;
  #closeBtnClickHandler = null;

  constructor(container, deferredModel, changeData, closeBtnClickHandler) {
    this.#container = container;
    this.#deferredModel = deferredModel;
    this.#changeData = changeData;
    this.#closeBtnClickHandler = closeBtnClickHandler;
  }

  init(bouquet) {
    this.#bouquet = bouquet;

    const prevModalComponent = this.#modalComponent;

    const isDeferred = this.#deferredModel.has(bouquet.id);
    this.#modalComponent = new ModalView(this.#bouquet, isDeferred);
    this.#modalSliderComponent = new ModalSliderView(this.#bouquet);

    this.#modalComponent.setCloseClickHandler(this.#closeBtnClickHandler);
    this.#modalComponent.setToggleDeferredClickHandler(this.#toggleDeferredClickHandler);

    if (prevModalComponent === null) {
      render(this.#modalComponent, this.#container);
      render(this.#modalSliderComponent, this.#modalComponent.descriptionContainer, RenderPosition.BEFOREBEGIN);
      this.#modalSliderComponent.init();
      return;
    }

    replace(this.#modalComponent, prevModalComponent);
    render(this.#modalSliderComponent, this.#modalComponent.descriptionContainer, RenderPosition.BEFOREBEGIN);
    this.#modalSliderComponent.init();
    remove(prevModalComponent);
  }

  #toggleDeferredClickHandler = () => {
    this.#changeData({...this.#bouquet});
  }

  destroy() {
    remove(this.#modalComponent);
    remove(this.#modalSliderComponent);
  }
}
