import DeferredView from '../view/deferred/deferred-view.js';
import HeroView from '../view/hero/hero-view.js';
import DeferredBackButtonView from '../view/deferred/deferred-back-button-view.js';
import DeferredCatalogView from '../view/deferred/deferred-catalog-view.js';
import DeferredEmptyListView from '../view/deferred/deferred-empty-list-view.js';
import DeferredBtnContainerView from '../view/deferred/deferred-btn-container-view.js';
import DeferredCleanButtonView from '../view/deferred/deferred-clean-button-view.js';
import DeferredSumView from '../view/deferred/deferred-sum-view.js';

import DeferredCardPresenter from './deferred-card-presenter.js';

import {render, RenderPosition, remove} from '../framework/render.js';
import {setToZeroOpacity, setToFullOpacity} from '../utils/animation.js';
import {UserAction, UpdateType} from '../const.js';

export default class DeferredPresenter {
  #deferredComponent = new DeferredView();
  #heroDeferredComponent = new HeroView({isPopup: true});
  #deferredBackButtonComponent = new DeferredBackButtonView();
  #deferredCatalogComponent = new DeferredCatalogView();
  #deferredEmptyListView = new DeferredEmptyListView();
  #deferredCatalogItemComponent = null;
  #deferredBtnContainerComponent = new DeferredBtnContainerView();
  #deferredCleanButtonComponent = new DeferredCleanButtonView();
  #deferredSumComponent = null;

  #container = null;
  #bouquetsModel = null;
  #deferredModel = null;
  #cardPresenters = new Map();

  #handleCloseDeferred = null;
  #handleBackToMain = null;

  constructor(container, bouquetsModel, deferredModel, handleCloseDeferred, handleBackToMain) {
    this.#container = container;
    this.#bouquetsModel = bouquetsModel;
    this.#deferredModel = deferredModel;
    this.#handleCloseDeferred = handleCloseDeferred;
    this.#handleBackToMain = handleBackToMain;

    this.#deferredModel.addObserver(this.#handleModelEvent);
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

  #renderDeferredItems(time = 500) {
    const bouquets = this.bouquets;
    const deferred = this.deferred;

    if (Object.keys(deferred.products).length === 0) {
      this.#renderDeferredEmptyList();
      return;
    }
    console.log(this.deferred);

    Object.entries(deferred.products).forEach(([id, count]) => {
      const bouquet = bouquets.find((item) => item.id == id);


      setTimeout(() => {
        this.#renderDeferredItem(bouquet, count);
      }, time);

    })
  }

  #clearDeferredItems(time = 500) {
    if (this.deferred.products.length === 0) {
      window.scrollTo(0, this.#deferredBackButtonComponent.element.offsetTop);
    }

    setToZeroOpacity(this.#deferredCatalogComponent.element, 0.5);

    setTimeout(() => {
      this.#cardPresenters.forEach((presenter) => presenter.destroy());
      this.#cardPresenters.clear();
      if (this.deferred.products.length === 0) {
        this.#renderDeferredEmptyList();
      }
      setToFullOpacity(this.#deferredCatalogComponent.element);
    }, time);
  }

  #renderDeferredEmptyList() {
    render(this.#deferredEmptyListView, this.#deferredCatalogComponent.element);
  }

  #renderDeferredItem(bouquet, count) {
    const cardPresenter = new DeferredCardPresenter(
      this.#deferredCatalogComponent.element,
      this.#deferredModel,
      this.#handleViewAction
    );

    cardPresenter.init(bouquet, count);

    this.#cardPresenters.set(bouquet.id, cardPresenter);
  }

  #handleViewAction = (actionType, updateType, updateBouquet) => {
    switch (actionType) {
      case UserAction.INCREMENT_BOUQUET:
        this.#handleIncrementBouquet(updateType, updateBouquet);
        break;
      case UserAction.DECREMENT_BOUQUET:
        this.#handleDecrementBouquet(updateType, updateBouquet);
        break;
      case UserAction.DELETE_BOUQUET:
        this.#handleDeleteBouquet(updateType, updateBouquet);
        break;
      case UserAction.CLEAN_ALL_BOUQUETS:
        this.#handleCleanAllBouquets(updateType);
        break;
      default:
        break;
    }
  }

  #handleIncrementBouquet = (updateType, updateBouquet) => {
    this.#deferredModel.increment(updateType, updateBouquet);
  }

  #handleDecrementBouquet = (updateType, updateBouquet) => {
    this.#deferredModel.decrement(updateType, updateBouquet);
  }

  #handleDeleteBouquet = (updateType, updateBouquet) => {
    this.#deferredModel.delete(updateType, updateBouquet);
  }

  #handleCleanAllBouquets = (updateType) => {
    this.#deferredModel.cleanAll(updateType);
  }

  #handleModelEvent = (updateType, data) => {
    switch (updateType) {
      case UpdateType.PATCH:
        this.#handlePatch(data);
        break;
      case UpdateType.MINOR:
        this.#handleMinor();
        break;
      case UpdateType.MAJOR:
        console.log(updateType, data);
        break;
      case UpdateType.INIT:
        console.log(updateType, data);
        break;
    }
  }

  #handlePatch = (data) => {
    if (this.#cardPresenters.has(data.id)) {
      const count = this.deferred.products[data.id];

      this.#cardPresenters.get(data.id).init(data, count);
    }
  }

  #handleMinor = () => {
    this.#clearDeferredItems();
    this.#renderDeferredItems();
  }

  #renderDeferredContent() {
    this.#deferredSumComponent = new DeferredSumView(this.deferred);

    render(this.#deferredBackButtonComponent, this.#deferredComponent.getDeferredContainer());
    this.#deferredBackButtonComponent.setClickHandler(this.#handleCloseDeferred);
    render(this.#deferredCatalogComponent, this.#deferredComponent.getDeferredContainer());
    this.#renderDeferredItems();
    render(this.#deferredBtnContainerComponent, this.#deferredComponent.getDeferredContainer());
    render(this.#deferredCleanButtonComponent, this.#deferredBtnContainerComponent.element);
    this.#deferredCleanButtonComponent.setClickHandler(() => {
      this.#handleViewAction(UserAction.CLEAN_ALL_BOUQUETS, UpdateType.MINOR);
    });
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
