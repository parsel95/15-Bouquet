import CatalogueView from '../view/catalogue/catalogue-view.js';
import SortingView from '../view/sorting-view.js';
import CatalogueListView from '../view/catalogue/catalogue-list-view.js';
import CatalogueEmptyListView from '../view/catalogue/catalogue-empty-list.js';
import LoadMoreButtonView from '../view/catalogue/catalogue-load-more-button-view.js';
import CatalogueReloadButtonView from '../view/catalogue/catalogue-reload-button-view.js';
import ScrollToTopButtonView from '../view/catalogue/catalogue-scroll-to-top-button-view.js';
import ErrorModalView from '../view/error-modal-view.js';
import CatalogueListLoadingView from '../view/catalogue/catalogue-list-loading-view.js';

import CatalogueCardPresenter from './catalogue-card-presenter.js';
import ModalPresenter from './modal-presenter.js';

import {render, RenderPosition, remove, replace} from '../framework/render.js';
import {setToZeroOpacity, setToFullOpacity} from '../utils/animation.js';
import {sortBouquetsByPriceUp, sortBouquetsByPriceDown} from '../utils/common.js';
import ScrollLock from '../utils/scroll-lock.js';
import {SortType, UserAction, UpdateType, CatalogueMessageType} from '../const.js';
import {filterReason, filterColor} from '../utils/filter.js';
import UiBlocker from '../framework/ui-blocker/ui-blocker.js';

const BOUQUET_COUNT_PER_STEP = 6;

export default class CataloguePresenter {
  #catalogueComponent = new CatalogueView();
  #sortingComponent = null;
  #catalogueListComponent = new CatalogueListView();
  #catalogueEmptyListComponent = new CatalogueEmptyListView();
  #loadMoreButtonComponent = new LoadMoreButtonView();
  #scrollToTopButtonComponent = new ScrollToTopButtonView();
  #reloadButtonComponent = new CatalogueReloadButtonView();
  #catalogueErrorModalComponent = new ErrorModalView();
  #catalogueListLoadingComponent = new CatalogueListLoadingView();

  #bodyContainer = null;
  #mainContainer = null;
  #bouquetsModel = null;
  #deferredModel = null;
  #filterModel = null;

  #cardPresenters = new Map();
  #modalPresenter = null;

  #selectedBouquet = null;
  #renderedBouquetsCount = BOUQUET_COUNT_PER_STEP;
  #savedRenderedBouquetsCount = null;
  #currentSortType = SortType.PRICE_UP;
  #isBouquetsLoading = true;
  #isDeferredLoading = true;
  #isBouquetsLoadError = false;
  #isDeferredChangingError = false;

  #scrollLock = new ScrollLock();
  #uiBlocker = new UiBlocker({lowerLimit: 350, upperLimit: 1000});

  constructor(bodyContainer, mainContainer, bouquetsModel, deferredModel, filterModel) {
    this.#bodyContainer = bodyContainer;
    this.#mainContainer = mainContainer;
    this.#bouquetsModel = bouquetsModel;
    this.#deferredModel = deferredModel;
    this.#filterModel = filterModel;

    this.#bouquetsModel.addObserver(this.#handleBouquetsModelEvent);
    this.#deferredModel.addObserver(this.#handleDeferredModelEvent);
    this.#filterModel.addObserver(this.#handleFilterModelEvent);
  }

  get bouquets() {
    const filterReasonType = this.#filterModel.reasonFilter;
    const filterColorTypes = this.#filterModel.colorFilters;
    const bouquets = this.#bouquetsModel.get();

    const filteredByReasonBouquets = filterReason[filterReasonType](bouquets);
    const filteredByColorBouquets = filterColorTypes.flatMap(
      (filter) => filterColor[filter](filteredByReasonBouquets)
    );

    switch (this.#currentSortType) {
      case SortType.PRICE_UP:
        return [...filteredByColorBouquets].sort(sortBouquetsByPriceUp);
      case SortType.PRICE_DOWN:
        return [...filteredByColorBouquets].sort(sortBouquetsByPriceDown);
    }

    return filteredByColorBouquets;
  }

  get deferred() {
    return this.#deferredModel.get();
  }

  getRenderedBouquetsCount() {
    return this.#renderedBouquetsCount;
  }

  init(savedCount) {
    if (savedCount) {
      this.#savedRenderedBouquetsCount = savedCount;
      this.#renderedBouquetsCount = savedCount;
    } else {
      this.#savedRenderedBouquetsCount = null;
      this.#renderedBouquetsCount = BOUQUET_COUNT_PER_STEP;
    }

    this.#isBouquetsLoading = !this.#bouquetsModel.getIsLoaded();
    this.#isDeferredLoading = !this.#deferredModel.getIsLoaded();
    this.#isBouquetsLoadError = this.#bouquetsModel.getIsLoadError();

    this.#renderCatalogue();
    this.#savedRenderedBouquetsCount = null;
  }

  #handleViewAction = async (actionType, updateType, updateBouquet) => {
    if (actionType === UserAction.UPDATE_BOUQUET) {
      this.#uiBlocker.block();

      try {
        await this.#handleUpdateBouquet(updateType, updateBouquet);
      } catch {
        this.#renderCatalogueErrorModal(CatalogueMessageType.ERROR_DEFERRED);
      } finally {
        this.#uiBlocker.unblock();
      }
    }
  }

  #handleUpdateBouquet(updateType, updatedBouquet) {
    return this.#deferredModel.toggleDeferred(updateType, updatedBouquet);
  }

  #renderCatalogueErrorModal(type) {
    this.#catalogueErrorModalComponent.setText(type);
    render(this.#catalogueErrorModalComponent, this.#bodyContainer);
    this.#catalogueErrorModalComponent.setClickHandler(this.#handleErrorModalClose);
    document.addEventListener('keydown', this.#onEscKeyDown);
    this.#isDeferredChangingError = true;
  }

  #handleErrorModalClose = () => {
    remove(this.#catalogueErrorModalComponent);
    this.#catalogueErrorModalComponent.removeClickHandler();

    if (!this.#modalPresenter) {
      document.removeEventListener('keydown', this.#onEscKeyDown);
    }

    this.#isDeferredChangingError = false;
  }

  #handleBouquetsModelEvent = (updateType) => {
    switch (updateType) {
      case UpdateType.INIT:
        this.#handleBouquetsInit();
        break;
      case UpdateType.LOADING:
        this.#handleBouquetsLoading();
        break;
    }
  }

  #handleBouquetsInit() {
    this.#isBouquetsLoading = !this.#bouquetsModel.getIsLoaded();
    this.#isBouquetsLoadError = this.#bouquetsModel.getIsLoadError();

    this.#renderCatalogue();
  }

  #handleBouquetsLoading() {
    remove(this.#catalogueEmptyListComponent);
    remove(this.#reloadButtonComponent);

    this.#isBouquetsLoading = !this.#bouquetsModel.getIsLoaded();
    this.#isBouquetsLoadError = this.#bouquetsModel.getIsLoadError();

    this.#renderCatalogue();
  }

  #handleDeferredModelEvent = (updateType, data) => {
    switch (updateType) {
      case UpdateType.PATCH:
        this.#handlePatch(data);
        break;
      case UpdateType.INIT:
        this.#handleDeferredInit();
        break;
    }
  }

  #handlePatch(data) {
    this.#updateCard(data);
    this.#updateModal(data);
  }

  #updateCard = (updatedBouquet) => {
    if (this.#cardPresenters.has(updatedBouquet.id)) {
      this.#cardPresenters.get(updatedBouquet.id).init(updatedBouquet);
    }
  }

  #updateModal = (updatedBouquet) => {
    if (this.#modalPresenter && this.#selectedBouquet.id === updatedBouquet.id) {
      this.#selectedBouquet = updatedBouquet;
      this.#modalPresenter.updateDeferredStatus();
    }
  }

  #handleDeferredInit() {
    this.#isDeferredLoading = !this.#deferredModel.getIsLoaded();

    this.#renderCatalogue();
  }

  #handleFilterModelEvent = (updateType) => {
    if (this.#isBouquetsLoadError) {
      return;
    }

    if (updateType === UpdateType.MINOR) {
      this.#handleMinor();
    }
  }

  #handleMinor() {
    this.#clearCatalogueList();
    this.#renderCatalogue(true);
  }

  #renderLoadMoreButton(container) {
    render(this.#loadMoreButtonComponent, container);
    this.#loadMoreButtonComponent.setClickHandler(this.#handleLoadMoreClick);
  }

  #handleLoadMoreClick = () => {
    const bouquetsCount = this.bouquets.length;

    if (bouquetsCount === 0) {
      return;
    }

    const newRenderedBouquetsCount = Math.min(bouquetsCount, this.#renderedBouquetsCount + BOUQUET_COUNT_PER_STEP);

    const bouquets = this.bouquets.slice(this.#renderedBouquetsCount, newRenderedBouquetsCount);

    this.#renderCards(bouquets, this.#catalogueListComponent.element);

    this.#renderedBouquetsCount += BOUQUET_COUNT_PER_STEP;

    if (this.#renderedBouquetsCount >= bouquetsCount) {
      remove(this.#loadMoreButtonComponent);
    }
  }

  #handleSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }

    this.#currentSortType = sortType;

    const bouquets = this.bouquets.slice(0, BOUQUET_COUNT_PER_STEP);
    this.#clearCatalogueList();
    this.#renderSorting(this.#catalogueComponent.getSortingContainer());
    this.#renderCatalogueList(bouquets, this.#catalogueComponent.getButtonsContainer());
  }

  #renderSorting(container) {
    if (!this.#sortingComponent) {
      this.#sortingComponent = new SortingView(this.#currentSortType);
      render(this.#sortingComponent, container);
    } else {
      const updatedSortingComponent = new SortingView(this.#currentSortType);
      replace(updatedSortingComponent, this.#sortingComponent);
      this.#sortingComponent = updatedSortingComponent;
    }

    this.#sortingComponent.setSortTypeChangeHandler(this.#handleSortTypeChange);
  }

  #renderScrollToTopButton(container) {
    render(this.#scrollToTopButtonComponent, container);
    this.#scrollToTopButtonComponent.setClickHandler(() => this.#catalogueComponent.scrollToSorting());
  }

  #clearCatalogueList() {
    this.#cardPresenters.forEach((presenter) => presenter.destroy());
    this.#cardPresenters.clear();
    this.#renderedBouquetsCount = BOUQUET_COUNT_PER_STEP;

    remove(this.#loadMoreButtonComponent);
    remove(this.#scrollToTopButtonComponent);
    remove(this.#catalogueEmptyListComponent);
  }

  #renderCatalogueList(bouquets, container) {
    render(this.#catalogueListComponent, container, RenderPosition.BEFOREBEGIN);
    this.#renderCards(bouquets, this.#catalogueListComponent.element);

    if (this.#renderedBouquetsCount < this.bouquets.length) {
      this.#renderLoadMoreButton(container);
    }

    this.#renderScrollToTopButton(container);
  }

  #renderCards(bouquets, container) {
    bouquets.forEach((bouquet) => this.#renderCard(bouquet, container));
  }

  #renderCard(bouquet, container) {
    const cardPresenter = new CatalogueCardPresenter(
      container,
      this.#deferredModel,
      this.#handleViewAction,
      this.#handleOpenModal
    );

    cardPresenter.init(bouquet);

    this.#cardPresenters.set(bouquet.id, cardPresenter);
  }

  #handleOpenModal = async (bouquet, time = 10) => {
    if (this.#selectedBouquet && this.#selectedBouquet.id === bouquet.id) {
      return;
    }

    if (this.#selectedBouquet && this.#selectedBouquet.id !== bouquet.id) {
      this.#handleCloseModal();
    }

    try {
      this.#selectedBouquet = await this.#bouquetsModel.getById(bouquet.id);
    } catch {
      this.#renderCatalogueErrorModal(CatalogueMessageType.ERROR_MODAL);
      return;
    }

    this.#renderModal();

    this.#scrollLock.disableScrolling();

    document.addEventListener('keydown', this.#onEscKeyDown);

    setTimeout(() => {
      setToFullOpacity(this.#modalPresenter.modalElement());
    }, time);
  }

  #handleCloseModal = (time = 500) => {
    setToZeroOpacity(this.#modalPresenter.modalElement(), 0.5);

    setTimeout(() => {
      this.#modalPresenter.destroy();
      this.#modalPresenter = null;
      this.#selectedBouquet = null;
      this.#scrollLock.enableScrolling();

      document.removeEventListener('keydown', this.#onEscKeyDown);

      setToFullOpacity(this.#catalogueComponent.element);
    }, time);
  }

  #renderModal() {
    if (!this.#modalPresenter) {
      this.#modalPresenter = new ModalPresenter(
        this.#bodyContainer,
        this.#deferredModel,
        this.#handleViewAction,
        this.#handleCloseModal
      );
    }

    this.#modalPresenter.init(this.#selectedBouquet);
  }

  #renderEmptyCatalogue(container) {
    if (this.#isBouquetsLoadError) {
      this.#catalogueEmptyListComponent.setText(CatalogueMessageType.ERROR_BOUQUETS);

      this.#reloadButtonComponent.setClickHandler(() => {
        this.#bouquetsModel.init();
      });

      render (this.#reloadButtonComponent, container);
    } else {
      this.#catalogueEmptyListComponent.setText(CatalogueMessageType.EMPTY);

      this.#loadMoreButtonComponent.element.disabled = true;
      this.#scrollToTopButtonComponent.element.disabled = true;

      this.#renderLoadMoreButton(container);
      this.#renderScrollToTopButton(container);
    }

    render(
      this.#catalogueEmptyListComponent,
      container,
      RenderPosition.BEFOREBEGIN
    );
  }

  #renderCatalogue(sorting = false) {
    const renderCount = this.#savedRenderedBouquetsCount ?? BOUQUET_COUNT_PER_STEP;
    const bouquets = this.bouquets.slice(0, renderCount);
    const buttonsContainer = this.#catalogueComponent.getButtonsContainer();

    if (this.#isBouquetsLoading || this.#isDeferredLoading) {
      render(this.#catalogueListLoadingComponent, this.#mainContainer);
      return;
    }

    remove(this.#catalogueListLoadingComponent);

    if (!sorting) {
      render(this.#catalogueComponent, this.#mainContainer);
      this.#renderSorting(this.#catalogueComponent.getSortingContainer());
    }

    if (!this.#isBouquetsLoading && bouquets.length === 0) {
      this.#renderEmptyCatalogue(buttonsContainer);
      return;
    }

    this.#loadMoreButtonComponent.element.disabled = false;
    this.#scrollToTopButtonComponent.element.disabled = false;

    this.#renderCatalogueList(bouquets, buttonsContainer);
    render(this.#uiBlocker, this.#bodyContainer);
  }

  #onEscKeyDown = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();

      if (this.#isDeferredChangingError) {
        this.#handleErrorModalClose();
        return;
      }

      this.#handleCloseModal();
    }
  }

  destroy() {
    document.removeEventListener('keydown', this.#onEscKeyDown);
    this.#scrollLock.enableScrolling();

    this.#bouquetsModel.removeObserver(this.#handleBouquetsModelEvent);
    this.#deferredModel.removeObserver(this.#handleDeferredModelEvent);
    this.#filterModel.removeObserver(this.#handleFilterModelEvent);

    this.#modalPresenter?.destroy();
    this.#modalPresenter = null;
    this.#selectedBouquet = null;
    this.#clearCatalogueList();

    remove(this.#catalogueComponent);
    remove(this.#sortingComponent);
    remove(this.#catalogueListComponent);
    remove(this.#reloadButtonComponent);
    remove(this.#catalogueErrorModalComponent);
    remove(this.#catalogueListLoadingComponent);

    remove(this.#uiBlocker);
  }
}
