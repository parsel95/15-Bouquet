import DeferredView from '../view/deferred/deferred-view.js';
import HeroView from '../view/hero/hero-view.js';
import DeferredBackButtonView from '../view/deferred/deferred-back-button-view.js';
import DeferredCatalogView from '../view/deferred/deferred-catalog-view.js';
import DeferredCatalogItemView from '../view/deferred/deferred-catalog-item-view.js';
import DeferredBtnContainerView from '../view/deferred/deferred-btn-container-view.js';
import DeferredCleanButtonView from '../view/deferred/deferred-clean-button-view.js';
import DeferredSumView from '../view/deferred/deferred-sum-view.js';

import {render, RenderPosition, remove} from '../framework/render.js';
import {bouquets} from '../mock/bouquets.js';

export default class DeferredPresenter {
  #deferredViewComponent = new DeferredView();
  #heroDeferredViewComponent = new HeroView({isPopup: true});
  #deferredBackButtonViewComponent = new DeferredBackButtonView();
  #deferredCatalogViewComponent = new DeferredCatalogView();
  #deferredCatalogItemViewComponent = null;
  #deferredBtnContainerViewComponent = new DeferredBtnContainerView();
  #deferredCleanButtonViewComponent = new DeferredCleanButtonView();
  #deferredSumViewComponent = null;

  #container = null;
  #bouquetsModel = null;
  #deferredModel = null;

  #handleCloseDeferred = null;
  #handleBackToMain = null;

  constructor(container, bouquetsModel, deferredModel, handleCloseDeferred, handleBackToMain) {
    this.#container = container;
    this.#bouquetsModel = bouquetsModel;
    this.#deferredModel = deferredModel;
    this.#handleCloseDeferred = handleCloseDeferred;
    this.#handleBackToMain = handleBackToMain;
  }

  get bouquets() {
    return this.#bouquetsModel.get();
  }

  get deferred() {
    return this.#deferredModel.get();
  }

  init() {
    this.#renderDeferredPage();
  }

  #renderHeroBlock() {
    render(this.#heroDeferredViewComponent, this.#deferredViewComponent.element, RenderPosition.AFTERBEGIN);
    this.#heroDeferredViewComponent.setCloseClickHandler(this.#handleBackToMain);
  }

  #renderDeferredItems() {
    const bouquets = this.bouquets;
    const deferred = this.deferred;

    Object.entries(deferred.products).forEach(([id, count]) => {
      const bouquet = bouquets.find((item) => item.id == id);

      const deferredItemViewComponent = new DeferredCatalogItemView(bouquet, count);

      render(deferredItemViewComponent, this.#deferredCatalogViewComponent.element);
    })
  }

  #renderDeferredContent() {
    this.#deferredSumViewComponent = new DeferredSumView(this.deferred);
    render(this.#deferredBackButtonViewComponent, this.#deferredViewComponent.getDeferredContainer());
    this.#deferredBackButtonViewComponent.setClickHandler(this.#handleCloseDeferred);
    render(this.#deferredCatalogViewComponent, this.#deferredViewComponent.getDeferredContainer());
    this.#renderDeferredItems();
    render(this.#deferredBtnContainerViewComponent, this.#deferredViewComponent.getDeferredContainer());
    render(this.#deferredCleanButtonViewComponent, this.#deferredBtnContainerViewComponent.element);
    render(this.#deferredSumViewComponent, this.#deferredViewComponent.getDeferredContainer());
  }

  #renderDeferredPage() {
    render(this.#deferredViewComponent, this.#container);
    this.#renderHeroBlock();
    this.#renderDeferredContent();
  }

  destroy() {
    remove(this.#deferredViewComponent);
    remove(this.#heroDeferredViewComponent);
    remove(this.#deferredBackButtonViewComponent);
    remove(this.#deferredCatalogViewComponent);
    remove(this.#deferredCatalogItemViewComponent);
    remove(this.#deferredCleanButtonViewComponent);
    remove(this.#deferredSumViewComponent);
  }
}
