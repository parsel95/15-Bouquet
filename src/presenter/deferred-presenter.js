import DeferredView from '../view/deferred/deferred-view.js';
import HeroView from '../view/hero/hero-view.js';
import DeferredBackButtonView from '../view/deferred/deferred-back-button-view.js';
import DeferredCatalogView from '../view/deferred/deferred-catalog-view.js';
import DeferredEmptyListView from '../view/deferred/deferred-empty-list-view.js';
import DeferredBtnContainerView from '../view/deferred/deferred-btn-container-view.js';
import DeferredCleanButtonView from '../view/deferred/deferred-clean-button-view.js';
import DeferredSumView from '../view/deferred/deferred-sum-view.js';
import ErrorModalView from '../view/error-modal-view.js';

import DeferredCardPresenter from './deferred-card-presenter.js';

import {render, RenderPosition, remove, replace} from '../framework/render.js';
import {setToZeroOpacity, setToFullOpacity} from '../utils/animation.js';
import {UserAction, UpdateType, CatalogueMessageType} from '../const.js';
import UiBlocker from '../framework/ui-blocker/ui-blocker.js';

export default class DeferredPresenter {
  #deferredComponent = new DeferredView();
  #heroDeferredComponent = new HeroView({isPopup: true});
  #deferredBackButtonComponent = new DeferredBackButtonView();
  #deferredCatalogComponent = new DeferredCatalogView();
  #deferredEmptyListComponent = new DeferredEmptyListView();
  #deferredErrorModalComponent = new ErrorModalView();
  #deferredCatalogItemComponent = null;
  #deferredBtnContainerComponent = new DeferredBtnContainerView();
  #deferredCleanButtonComponent = new DeferredCleanButtonView();
  #deferredSumComponent = null;

  #mainContainer = null;
  #bodyContainer = null;
  #bouquetsModel = null;
  #deferredModel = null;
  #cardPresenters = new Map();

  #handleCloseDeferred = null;
  #handleBackToMain = null;

  #uiBlocker = new UiBlocker({lowerLimit: 350, upperLimit: 1000});

  #cleanAllUiBlocker = new UiBlocker({showLoader: false});

  constructor(container, bodyContainer, bouquetsModel, deferredModel, handleCloseDeferred, handleBackToMain) {
    this.#mainContainer = container;
    this.#bodyContainer = bodyContainer;
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
    render(this.#deferredEmptyListComponent, this.#deferredCatalogComponent.element);
    this.#deferredCleanButtonComponent.element.disabled = true;
  }

  #renderDeferredErrorModal(type) {
    this.#deferredErrorModalComponent.setText(type)
    render(this.#deferredErrorModalComponent, this.#mainContainer);
    this.#deferredErrorModalComponent.setClickHandler(this.#handleErrorModalClose);
    document.addEventListener('keydown', this.#onEscKeyDown);
  }

  #handleErrorModalClose = () => {
    remove(this.#deferredErrorModalComponent);
    this.#deferredErrorModalComponent.removeClickHandler();
    document.removeEventListener('keydown', this.#onEscKeyDown);
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

  #handleViewAction = async (actionType, updateType, updateBouquet) => {
    const uiBlocker = actionType === UserAction.CLEAN_ALL_BOUQUETS
      ? this.#cleanAllUiBlocker
      : this.#uiBlocker;

    uiBlocker.block();

    try {
      switch (actionType) {
        case UserAction.INCREMENT_BOUQUET:
          await this.#handleIncrementBouquet(updateType, updateBouquet);
          break;
        case UserAction.DELETE_CARD_BOUQUET:
          await this.#handleDeleteCardBouquet(updateType, updateBouquet);
          break;
        case UserAction.DELETE_BOUQUET:
          await this.#handleDeleteBouquet(updateType, updateBouquet);
          break;
        case UserAction.CLEAN_ALL_BOUQUETS:
          await this.#handleCleanAllBouquets(updateType);
          break;
        default:
          break;
      }
    } catch {
      this.#renderDeferredErrorModal(CatalogueMessageType.ERROR_DEFERRED);
    } finally {
      uiBlocker.unblock();
    }
  }

  #handleIncrementBouquet = (updateType, updateBouquet) => {
    return this.#deferredModel.add(updateType, updateBouquet);
  }

  #handleDeleteBouquet = async (updateType, updateBouquet) => {
    return this.#deferredModel.delete(updateType, updateBouquet);
  }

  #handleDeleteCardBouquet = (updateType, updateBouquet) => {
    return this.#deferredModel.deleteCard(updateType, updateBouquet);
  }

  #handleCleanAllBouquets = async (updateType) => {
    return this.#deferredModel.cleanAll(updateType);
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

    if (this.#deferredEmptyListComponent && Object.keys(this.deferred.products).length !== 0) {
      remove(this.#deferredEmptyListComponent);
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
    render(this.#deferredComponent, this.#mainContainer);
    this.#renderHeroBlock();
    this.#renderDeferredContent();
    render(this.#uiBlocker, this.#bodyContainer);
    render(this.#cleanAllUiBlocker, this.#bodyContainer);
  }

  #onEscKeyDown = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this.#handleErrorModalClose();
    }
  }

  destroy() {
    document.removeEventListener('keydown', this.#onEscKeyDown);

    this.#deferredModel.removeObserver(this.#handleModelEvent);

    this.#cardPresenters.forEach((presenter) => presenter.destroy());
    this.#cardPresenters.clear();

    remove(this.#deferredComponent);
    remove(this.#heroDeferredComponent);
    remove(this.#deferredBackButtonComponent);
    remove(this.#deferredCatalogComponent);
    remove(this.#deferredCatalogItemComponent);
    remove(this.#deferredEmptyListComponent);
    remove(this.#deferredCleanButtonComponent);
    remove(this.#deferredSumComponent);
    remove(this.#deferredErrorModalComponent);

    remove(this.#uiBlocker);
    remove(this.#cleanAllUiBlocker);
  }
}
