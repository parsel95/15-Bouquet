import CatalogueView from '../view/catalogue/catalogue-view.js';
import SortingView from '../view/sorting-view.js';
import CatalogueListView from '../view/catalogue/catalogue-list-view.js';
import CatalogueEmptyListView from '../view/catalogue/catalogue-empty-list.js';
import CatalogueButtonMoreView from '../view/catalogue/catalogue-button-more-view.js';
import ButtonToTopView from '../view/catalogue/catalogue-button-to-top-view.js';

import CardPresenter from './card-presenter.js';
import ModalPresenter from './modal-presenter.js';

import {render, RenderPosition, remove} from '../framework/render.js';

const BOUQUET_COUNT_PER_STEP = 6;

export default class CataloguePresenter {
  #catalogueViewComponent = new CatalogueView();
  #sortingViewComponent = new SortingView();
  #catalogueListViewComponent = new CatalogueListView();
  #catalogueEmptyListViewComponent = new CatalogueEmptyListView();
  #buttonMoreViewComponent = new CatalogueButtonMoreView();
  #buttonToTopViewComponent = new ButtonToTopView();

  #bodyContainer = null;
  #mainContainer = null;
  #bouquetsModel = null;
  #deferredModel = null;

  #cardPresenter = null;
  #modalPresenter = null;

  #renderedBouquetsCount = BOUQUET_COUNT_PER_STEP;
  #savedRenderedBouquetsCount = null;

  constructor(bodyContainer, mainContainer, bouquetsModel, deferredModel) {
    this.#bodyContainer = bodyContainer;
    this.#mainContainer = mainContainer;
    this.#bouquetsModel = bouquetsModel;
    this.#deferredModel = deferredModel;
  }

  get bouquets() {
    return this.#bouquetsModel.get();
  };

  get deferred() {
    return this.#deferredModel.get();
  }

  getRenderedBouquetsCount() {
    return this.#renderedBouquetsCount;
  }

  setRenderedBouquetsCount(count) {
    this.#savedRenderedBouquetsCount = count;
  }

  init(savedCount) {
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

  #renderButtonMore(container) {
    render(this.#buttonMoreViewComponent, container);
    this.#buttonMoreViewComponent.setClickHandler(this.#handleButtonMoreClick);
  }

  #handleButtonMoreClick = () => {
    const bouquetsCount = this.bouquets.length;

    const newRenderedBouquetsCount = Math.min(bouquetsCount, this.#renderedBouquetsCount + BOUQUET_COUNT_PER_STEP);

    const bouquets = this.bouquets.slice(this.#renderedBouquetsCount, newRenderedBouquetsCount);

    this.#renderCards(bouquets, this.#catalogueListViewComponent.element);

    this.#renderedBouquetsCount += BOUQUET_COUNT_PER_STEP;

    if (this.#renderedBouquetsCount >= bouquetsCount) {
      remove(this.#buttonMoreViewComponent);
    }
  }

  #renderButtonToTop(container) {
    render(this.#buttonToTopViewComponent, container);
    this.#buttonToTopViewComponent.setClickHandler(() => this.#catalogueViewComponent.scrollToStart());
  }

  #renderButtons(container) {
    this.#renderButtonMore(container);
    this.#renderButtonToTop(container);
  }

  #renderCardList(bouquets, container) {
    this.#renderCards(bouquets, container);

    if (this.bouquets.length > BOUQUET_COUNT_PER_STEP) {
      this.#renderButtonMore(this.#catalogueViewComponent.getBtnWrap());
    }

    this.#renderButtonToTop(this.#catalogueViewComponent.getBtnWrap());
  }

  #renderCards(bouquets, container) {
    bouquets.forEach((bouquet) => this.#renderCard(bouquet, container));
  }

  #handleOpenModal = (bouquet) => {
    this.#renderModal(bouquet, this.#bodyContainer);
    this.#modalPresenter.setCloseClickHandler(this.#handleCloseModal);
    document.addEventListener('keydown', this.#onEscKeyDown);
  }

  #handleCloseModal = () => {
    this.#modalPresenter.destroy();
    document.removeEventListener('keydown', this.#onEscKeyDown);
  }

  #renderCard(bouquet, container) {
    const cardPresenter = new CardPresenter(container);
    cardPresenter.init(bouquet, this.deferred);
    cardPresenter.setOpenClickHandler(() => this.#handleOpenModal(bouquet));
  }

  #renderModal(bouquet, container) {
    this.#modalPresenter = new ModalPresenter(container);
    this.#modalPresenter.init(bouquet);
  }

  #renderCatalogue() {
    const renderCount = this.#savedRenderedBouquetsCount || BOUQUET_COUNT_PER_STEP;
    const bouquets = this.bouquets.slice(0, renderCount);

    render(this.#catalogueViewComponent, this.#mainContainer);
    render(this.#sortingViewComponent, this.#catalogueViewComponent.getSortingContainer());

    if (bouquets.length === 0) {
      render(this.#catalogueEmptyListViewComponent, this.#catalogueViewComponent.getBtnWrap(), RenderPosition.BEFOREBEGIN);
      this.#renderButtons(this.#catalogueViewComponent.getBtnWrap());
      return;
    }

    render(this.#catalogueListViewComponent, this.#catalogueViewComponent.getBtnWrap(), RenderPosition.BEFOREBEGIN);
    this.#renderCardList(bouquets, this.#catalogueListViewComponent.element);
  }

  #onEscKeyDown = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this.#handleCloseModal();
      document.removeEventListener('keydown', this.#onEscKeyDown);
    }
  }

  destroy() {
    remove(this.#catalogueViewComponent);
    remove(this.#sortingViewComponent);
    remove(this.#catalogueListViewComponent);
    remove(this.#catalogueEmptyListViewComponent);
    remove(this.#buttonMoreViewComponent);
    remove(this.#buttonToTopViewComponent);
  }
}
