import DeferredView from '../view/deferred/deferred-view.js';
import DeferredContainerView from '../view/deferred/deferred-container-view.js';
import HeroView from '../view/hero/hero-view.js';
import DeferredCatalogView from '../view/deferred/deferred-catalog-view.js';
import DeferredCatalogItemView from '../view/deferred/deferred-catalog-item-view.js';
import DeferredSumView from '../view/deferred/deferred-sum-view.js';

import {render, RenderPosition} from '../framework/render.js';
import {bouquets} from '../mock/bouquets.js';

export default class DeferredPresenter {
  #deferredViewComponent = new DeferredView();
  #deferredContainerViewComponent = new DeferredContainerView();
  #heroDeferredViewComponent = new HeroView({isPopup: true});
  #deferredCatalogViewComponent = new DeferredCatalogView();
  #deferredCatalogItemViewComponent = null;
  #deferredSumViewComponent = null;

  #container = null;
  #bouquetsModel = null;
  #deferredModel = null;

  constructor(container, bouquetsModel, deferredModel) {
    this.#container = container;
    this.#bouquetsModel = bouquetsModel;
    this.#deferredModel = deferredModel;
  }

  get bouquets () {
    return this.#bouquetsModel.get();
  }

  get deferred () {
    return this.#deferredModel.get();
  }

  #renderDeferredItems = () => {
    const bouquets = this.bouquets;
    const deferred = this.deferred;

    Object.entries(deferred.products).forEach(([id, count]) => {
      const bouquet = bouquets.find((item) => item.id == id);

      const deferredItemView = new DeferredCatalogItemView(bouquet, count);

      render(deferredItemView, this.#deferredCatalogViewComponent.element);
    })
  }

  init() {
    render(this.#deferredViewComponent, this.#container);
    render(this.#heroDeferredViewComponent, this.#deferredViewComponent.element);
    render(this.#deferredContainerViewComponent, this.#deferredViewComponent.element);
    render(this.#deferredCatalogViewComponent, this.#deferredContainerViewComponent.getDeferredBackButton(), RenderPosition.AFTEREND);

    this.#renderDeferredItems();

    this.#deferredSumViewComponent = new DeferredSumView(this.deferred)
    render(this.#deferredSumViewComponent, this.#deferredContainerViewComponent.element);
  }
}
