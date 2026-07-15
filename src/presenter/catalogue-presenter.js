import CatalogueView from '../view/catalogue/catalogue-view.js';
import SortingView from '../view/sorting-view.js';
import CatalogueListView from '../view/catalogue/catalogue-list-view.js';
import CatalogueEmptyListView from '../view/catalogue/catalogue-empty-list.js';
import LoadMoreButtonView from '../view/catalogue/catalogue-load-more-button-view.js';
import ScrollToTopButtonView from '../view/catalogue/catalogue-scroll-to-top-button-view.js';

import CardPresenter from './card-presenter.js';
import ModalPresenter from './modal-presenter.js';

import {render, RenderPosition, remove} from '../framework/render.js';
import {updateItem} from '../utils/common.js';
import ScrollLock from '../utils/scroll-lock.js';

const BOUQUET_COUNT_PER_STEP = 6;

export default class CataloguePresenter {
  #catalogueComponent = new CatalogueView();
  #sortingComponent = null;
  #catalogueListComponent = new CatalogueListView();
  #catalogueEmptyListComponent = new CatalogueEmptyListView();
  #loadMoreButtonComponent = new LoadMoreButtonView();
  #scrollToTopButtonComponent = new ScrollToTopButtonView();

  #bodyContainer = null;
  #mainContainer = null;
  #bouquetsModel = null;
  #deferredModel = null;

  #cardPresenters = new Map();
  #modalPresenter = null;

  #bouquets = [];
  #selectedBouquet = null;
  #renderedBouquetsCount = BOUQUET_COUNT_PER_STEP;
  #savedRenderedBouquetsCount = null;

  #scrollLock = new ScrollLock();

  constructor(bodyContainer, mainContainer, bouquetsModel, deferredModel) {
    this.#bodyContainer = bodyContainer;
    this.#mainContainer = mainContainer;
    this.#bouquetsModel = bouquetsModel;
    this.#deferredModel = deferredModel;
  }

  get bouquets() {
    return this.#bouquetsModel.get();
  }

  get deferred() {
    return this.#deferredModel.get();
  }

  getRenderedBouquetsCount() {
    return this.#renderedBouquetsCount;
  }

  init(savedCount) {
    this.#bouquets = this.bouquets;
    if (savedCount) {
      this.#savedRenderedBouquetsCount = savedCount;
      this.#renderedBouquetsCount = savedCount;
    } else {
      this.#savedRenderedBouquetsCount = null;
      this.#renderedBouquetsCount = BOUQUET_COUNT_PER_STEP;
    }

    this.#renderCatalogue();
    this.#savedRenderedBouquetsCount = null;
  }

  #handleUpdateBouquet = (updatedBouquet) => {
    this.#deferredModel.toggleFavorite(updatedBouquet);
    this.#cardPresenters.get(updatedBouquet.id).init(updatedBouquet);
  };

  #handleUpdateModal = (updatedBouquet) => {
    if (this.#modalPresenter && this.#selectedBouquet.id === updatedBouquet.id) {
      this.#selectedBouquet = updatedBouquet;
      this.#deferredModel.toggleFavorite(updatedBouquet);
      this.#renderModal();
    }
  }

  #renderLoadMoreButton(container) {
    render(this.#loadMoreButtonComponent, container);
    this.#loadMoreButtonComponent.setClickHandler(this.#handleLoadMoreClick);
  }

  #handleLoadMoreClick = () => {
    const bouquetsCount = this.#bouquets.length;

    if (bouquetsCount === 0) {
      return;
    }

    const newRenderedBouquetsCount = Math.min(bouquetsCount, this.#renderedBouquetsCount + BOUQUET_COUNT_PER_STEP);

    const bouquets = this.#bouquets.slice(this.#renderedBouquetsCount, newRenderedBouquetsCount);

    this.#renderCards(bouquets, this.#catalogueListComponent.element);

    this.#renderedBouquetsCount += BOUQUET_COUNT_PER_STEP;

    if (this.#renderedBouquetsCount >= bouquetsCount) {
      remove(this.#loadMoreButtonComponent);
    }
  }

  #renderScrollToTopButton(container) {
    render(this.#scrollToTopButtonComponent, container);
    this.#scrollToTopButtonComponent.setClickHandler(() => this.#catalogueComponent.scrollToSorting());
  }

  #renderSorting(container) {
    this.#sortingComponent = new SortingView();
    render(this.#sortingComponent, container);
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

    if (this.#renderedBouquetsCount < this.#bouquets.length) {
      this.#renderLoadMoreButton(container);
    }

    this.#renderScrollToTopButton(container);
  }

  #renderCards(bouquets, container) {
    bouquets.forEach((bouquet) => this.#renderCard(bouquet, container));
  }

  #renderCard(bouquet, container) {
    const cardPresenter = new CardPresenter(
      container,
      this.#deferredModel,
      this.#handleUpdateBouquet,
      this.#handleOpenModal
    );

    cardPresenter.init(bouquet);

    this.#cardPresenters.set(bouquet.id, cardPresenter);
  }

  #handleOpenModal = (bouquet) => {
    if (this.#selectedBouquet && this.#selectedBouquet.id === bouquet.id) {
      return;
    }

    if (this.#selectedBouquet && this.#selectedBouquet.id !== bouquet.id) {
      this.#handleCloseModal();
    }

    this.#selectedBouquet = bouquet;
    this.#renderModal();

    this.#scrollLock.disableScrolling();

    document.addEventListener('keydown', this.#onEscKeyDown);
  }

  #handleCloseModal = () => {
    this.#modalPresenter.destroy();
    this.#modalPresenter = null;
    this.#selectedBouquet = null;
    this.#scrollLock.enableScrolling();

    document.removeEventListener('keydown', this.#onEscKeyDown);
  }

  #renderModal() {
    if (!this.#modalPresenter) {
      this.#modalPresenter = new ModalPresenter(
        this.#bodyContainer,
        this.#deferredModel,
        this.#handleUpdateModal,
        this.#handleCloseModal
      );
    }

    this.#modalPresenter.init(this.#selectedBouquet);
  }

  #renderEmptyCatalogue(container) {
    render(this.#catalogueEmptyListComponent, container, RenderPosition.BEFOREBEGIN);
    this.#renderLoadMoreButton(container);
    this.#renderScrollToTopButton(container);
  }

  #renderCatalogue() {
    const renderCount = this.#savedRenderedBouquetsCount ?? BOUQUET_COUNT_PER_STEP;
    const bouquets = this.#bouquets.slice(0, renderCount);
    const buttonsContainer = this.#catalogueComponent.getButtonsContainer();

    render(this.#catalogueComponent, this.#mainContainer);
    this.#renderSorting(this.#catalogueComponent.getSortingContainer());

    if (bouquets.length === 0) {
      this.#renderEmptyCatalogue(buttonsContainer);
      return;
    }

    this.#renderCatalogueList(bouquets, buttonsContainer);
  }

  #onEscKeyDown = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this.#handleCloseModal();
    }
  }

  destroy() {
    document.removeEventListener('keydown', this.#onEscKeyDown);
    this.#scrollLock.enableScrolling();

    this.#modalPresenter?.destroy();
    this.#modalPresenter = null;
    this.#selectedBouquet = null;
    this.#clearCatalogueList();

    remove(this.#catalogueComponent);
    remove(this.#sortingComponent);
    remove(this.#catalogueListComponent);
  }
}
