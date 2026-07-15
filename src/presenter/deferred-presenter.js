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
  #deferredComponent = new DeferredView();
  #heroDeferredComponent = new HeroView({isPopup: true});
  #deferredBackButtonComponent = new DeferredBackButtonView();
  #deferredCatalogComponent = new DeferredCatalogView();
  #deferredCatalogItemComponent = null;
  #deferredBtnContainerComponent = new DeferredBtnContainerView();
  #deferredCleanButtonComponent = new DeferredCleanButtonView();
  #deferredSumComponent = null;

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
    render(this.#heroDeferredComponent, this.#deferredComponent.element, RenderPosition.AFTERBEGIN);
    this.#heroDeferredComponent.setCloseClickHandler(this.#handleBackToMain);
  }

  #renderDeferredItems() {
    const bouquets = this.bouquets;
    const deferred = this.deferred;

    Object.entries(deferred.products).forEach(([id, count]) => {
      const bouquet = bouquets.find((item) => item.id == id);

      const deferredItemViewComponent = new DeferredCatalogItemView(bouquet, count);

      render(deferredItemViewComponent, this.#deferredCatalogComponent.element);
    })
  }

  #renderDeferredContent() {
    this.#deferredSumComponent = new DeferredSumView(this.deferred);
    render(this.#deferredBackButtonComponent, this.#deferredComponent.getDeferredContainer());
    this.#deferredBackButtonComponent.setClickHandler(this.#handleCloseDeferred);
    render(this.#deferredCatalogComponent, this.#deferredComponent.getDeferredContainer());
    this.#renderDeferredItems();
    render(this.#deferredBtnContainerComponent, this.#deferredComponent.getDeferredContainer());
    render(this.#deferredCleanButtonComponent, this.#deferredBtnContainerComponent.element);
    render(this.#deferredSumComponent, this.#deferredComponent.getDeferredContainer());
  }

  #renderDeferredPage() {
    render(this.#deferredComponent, this.#container);
    this.#renderHeroBlock();
    this.#renderDeferredContent();
  }

  destroy() {
    remove(this.#deferredComponent);
    remove(this.#heroDeferredComponent);
    remove(this.#deferredBackButtonComponent);
    remove(this.#deferredCatalogComponent);
    remove(this.#deferredCatalogItemComponent);
    remove(this.#deferredCleanButtonComponent);
    remove(this.#deferredSumComponent);
  }
}
