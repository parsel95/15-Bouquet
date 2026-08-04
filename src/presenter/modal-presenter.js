import ModalView from '../view/modal/modal-view.js';
import {render, remove, replace} from '../framework/render.js';
import {UserAction, UpdateType} from '../const.js';

export default class ModalPresenter {
  #modalComponent = null;

  #container = null;
  #deferredModel = null;

  #bouquet = null;

  #changeData = null;
  #handleCloseModal = null;

  constructor(container, deferredModel, changeData, handleCloseModal) {
    this.#container = container;
    this.#deferredModel = deferredModel;
    this.#changeData = changeData;
    this.#handleCloseModal = handleCloseModal;
  }

  init(bouquet) {
    this.#bouquet = bouquet;

    const prevModalComponent = this.#modalComponent;

    const isDeferred = this.#deferredModel.has(bouquet.id);
    this.#modalComponent = new ModalView(this.#bouquet, isDeferred);

    this.#modalComponent.setCloseClickHandler(this.#handleCloseModal);
    this.#modalComponent.setDeferredClickHandler(this.#handleDeferredClick);

    if (prevModalComponent === null) {
      render(this.#modalComponent, this.#container);
      this.#modalComponent.initSlider();
      return;
    }

    replace(this.#modalComponent, prevModalComponent);
    this.#modalComponent.initSlider();
    remove(prevModalComponent);
  }

  #handleDeferredClick = () => {
    this.#changeData(
      UserAction.UPDATE_BOUQUET,
      UpdateType.PATCH,
      {...this.#bouquet}
    );
  }

  updateDeferredStatus() {
    const isDeferred = this.#deferredModel.has(this.#bouquet.id);
    this.#modalComponent.updateDeferredStatus(isDeferred);
  }

  destroy() {
    remove(this.#modalComponent);
  }
}
