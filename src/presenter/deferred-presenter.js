import DeferredView from '../view/deferred/deferred-view.js';
import HeroView from '../view/hero/hero-view.js';
import DeferredBackButtonView from '../view/deferred/deferred-back-button-view.js';
import DeferredCatalogView from '../view/deferred/deferred-catalog-view.js';
import DeferredEmptyListView from '../view/deferred/deferred-empty-list-view.js';
import DeferredBtnContainerView from '../view/deferred/deferred-btn-container-view.js';
import DeferredCleanButtonView from '../view/deferred/deferred-clean-button-view.js';
import DeferredSumView from '../view/deferred/deferred-sum-view.js';

import DeferredCardPresenter from './deferred-card-presenter.js';

import {render, RenderPosition, remove, replace} from '../framework/render.js';
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

  #renderDeferredItems(time = 0) {
    const bouquets = this.bouquets;
    const deferred = this.deferred;

    this.#deferredCleanButtonComponent.element.disabled = false;

    if (Object.keys(deferred.products).length === 0) {
      this.#renderDeferredEmptyList();
      return;
    }

    Object.entries(deferred.products).forEach(([id, count]) => {
      const bouquet = bouquets.find((item) => item.id == id);

      this.#renderDeferredItem(bouquet, count);
    })
  }

  #clearDeferredItems() {
    if (Object.keys(this.deferred.products).length === 0) {
      window.scrollTo(0, this.#deferredBackButtonComponent.element.offsetTop);
    }

    this.#cardPresenters.forEach((presenter) => presenter.destroy());
    this.#cardPresenters.clear();
  }

  #renderDeferredEmptyList() {
    render(this.#deferredEmptyListView, this.#deferredCatalogComponent.element);
    this.#deferredCleanButtonComponent.element.disabled = true;
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
      case UserAction.DELETE_CARD_BOUQUET:
        this.#handleDeleteCardBouquet(updateType, updateBouquet);
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
    this.#deferredModel.add(updateType, updateBouquet);
  }

  #handleDeleteCardBouquet = (updateType, updateBouquet) => {
    this.#deferredModel.deleteCard(updateType, updateBouquet);
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
    }
  }

  #handlePatch = (data) => {
    if (this.#cardPresenters.has(data.id)) {
      const count = this.deferred.products[data.id];

      this.#cardPresenters.get(data.id).init(data, count);
      this.#updateSumComponent();
    }
  }

  #handleMinor = () => {
    this.#clearDeferredItems();
    this.#renderDeferredItems();
    this.#updateSumComponent();

    if (this.#deferredEmptyListView && Object.keys(this.deferred.products).length !== 0) {
      remove(this.#deferredEmptyListView);
    }
  }

  #renderDeferredSum() {
    this.#deferredSumComponent = new DeferredSumView(this.deferred);
    render(this.#deferredSumComponent, this.#deferredComponent.getDeferredContainer());
  }

  #updateSumComponent = () => {
    const prevComponent = this.#deferredSumComponent;

    this.#deferredSumComponent = new DeferredSumView(this.deferred);

    replace(this.#deferredSumComponent, prevComponent);
    remove(prevComponent);
  }

  #renderDeferredContent() {
    render(this.#deferredBackButtonComponent, this.#deferredComponent.getDeferredContainer());
    this.#deferredBackButtonComponent.setClickHandler(this.#handleCloseDeferred);
    render(this.#deferredCatalogComponent, this.#deferredComponent.getDeferredContainer());
    this.#renderDeferredItems();
    render(this.#deferredBtnContainerComponent, this.#deferredComponent.getDeferredContainer());
    render(this.#deferredCleanButtonComponent, this.#deferredBtnContainerComponent.element);
    this.#deferredCleanButtonComponent.setClickHandler(() => {
      this.#handleViewAction(UserAction.CLEAN_ALL_BOUQUETS, UpdateType.MINOR);
    });
    this.#renderDeferredSum();
  }

  #renderDeferredPage() {
    render(this.#deferredComponent, this.#container);
    this.#renderHeroBlock();
    this.#renderDeferredContent();
  }

  destroy() {
    this.#deferredModel.removeObserver(this.#handleModelEvent);

    this.#cardPresenters.forEach((presenter) => presenter.destroy());
    this.#cardPresenters.clear();

    remove(this.#deferredComponent);
    remove(this.#heroDeferredComponent);
    remove(this.#deferredBackButtonComponent);
    remove(this.#deferredCatalogComponent);
    remove(this.#deferredCatalogItemComponent);
    remove(this.#deferredEmptyListView);
    remove(this.#deferredCleanButtonComponent);
    remove(this.#deferredSumComponent);
  }
}
