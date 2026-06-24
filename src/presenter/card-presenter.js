import CardView from '../view/card/card-view.js';
import {render, remove} from '../framework/render.js';

export default class CardPresenter {
  #container = null;
  #cardViewComponent = null;
  #bouquet = null;
  #deferred = null;
  #isFavorite = false;

  constructor(container) {
    this.#container = container;
  }

  init(bouquet, deferred) {
    this.#bouquet = bouquet;
    this.#deferred = deferred;

    this.#setIsFavorite();
    this.#cardViewComponent = new CardView(this.#bouquet, this.#isFavorite);

    render(this.#cardViewComponent, this.#container);
  }

  #setIsFavorite() {
    this.#isFavorite = this.#bouquet.id in this.#deferred.products;
  }

  setOpenClickHandler(handler) {
    this.#cardViewComponent.setOpenClickHandler(handler);
  }

  setAddToDeferredClickHanlder(handler) {
    this.#cardViewComponent.setAddToDeferredClickHanlder(handler);
  }

  destroy() {
    remove(this.#cardViewComponent);
  }
}
