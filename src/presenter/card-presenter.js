import CardView from '../view/card/card-view.js';
import {render, remove, replace} from '../framework/render.js';

export default class CardPresenter {
  #cardComponent = null;

  #container = null;
  #deferredModel = null;

  #bouquet = null;

  #changeData = null;
  #clickCardHandler = null;

  constructor(container, deferredModel, changeData, clickCardHandler) {
    this.#container = container;
    this.#deferredModel = deferredModel;
    this.#changeData = changeData;
    this.#clickCardHandler = clickCardHandler;
  }

  init(bouquet) {
    this.#bouquet = bouquet;

    const prevCardComponent = this.#cardComponent;

    const isDeferred = this.#deferredModel.has(bouquet.id);
    this.#cardComponent = new CardView(this.#bouquet, isDeferred);

    this.#cardComponent.setOpenClickHandler(() => {
      this.#clickCardHandler(this.#bouquet);
    });
    this.#cardComponent.setToggleDeferredClickHandler(this.#toggleDeferredClickHandler);

    if (prevCardComponent === null) {
      render(this.#cardComponent, this.#container);
      return;
    }

    replace(this.#cardComponent, prevCardComponent);
    remove(prevCardComponent);
  }

  #toggleDeferredClickHandler = () => {
    this.#changeData({...this.#bouquet});
  }

  destroy() {
    remove(this.#cardComponent);
  }
}
