import CatalogueView from '../view/catalogue/catalogue-view.js';
import SortingView from '../view/sorting-view.js';
import CatalogueListView from '../view/catalogue/catalogue-list-view.js';
import CatalogueEmptyListView from '../view/catalogue/catalogue-empty-list.js';
import CatalogueButtonMoreView from '../view/catalogue/catalogue-button-more-view.js';
import ButtonToTopView from '../view/catalogue/cataloge-button-to-top-view.js';

import CardPresenter from './card-presenter.js';
import ModalPresenter from './modal-presenter.js';

import {render, RenderPosition, remove} from '../framework/render.js';

const BOUQUET_COUNT_PER_STEP = 6;

export default class CataloguePresentor {
  #catalogueViewComponent = new CatalogueView();
  #sortingViewComponent = new SortingView();
  #catalogueListViewComponent = new CatalogueListView();
  #catalogueEmptyListViewComponent = new CatalogueEmptyListView();
  #buttonMoreViewComponent = new CatalogueButtonMoreView();
  #buttonToTopViewComponent = new ButtonToTopView();

  #mainContainer = null;
  #bodyContainer = null;
  #buttonsContainer = this.#catalogueViewComponent.getBtnWrap();
  #bouquetsModel = null;

  #cardPresenter = null;
  #modalPresenter = null;

  #renderedBouquetsCount = BOUQUET_COUNT_PER_STEP;

  constructor(mainContainer, bodyContainer, bouquetsModel) {
    this.#mainContainer = mainContainer;
    this.#bodyContainer = bodyContainer;
    this.#bouquetsModel = bouquetsModel;
  }

  get bouquets () {
    return this.#bouquetsModel.get();
  };

  init() {
    this.#renderCatalogue();
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
    this.#buttonToTopViewComponent.setClickHandler(this.#handleButtonToTopClick);
  }

  #handleButtonToTopClick = () => {
    this.#catalogueViewComponent.getSortingContainer().scrollIntoView({behavior: 'smooth'});
  }

  #renderButtons(container) {
    this.#renderButtonMore(container);
    this.#renderButtonToTop(container);
  }

  #renderCardList(bouquets, container) {
    this.#renderCards(bouquets, container);

    if (this.bouquets.length > BOUQUET_COUNT_PER_STEP) {
      this.#renderButtonMore(this.#buttonsContainer);
    }

    this.#renderButtonToTop(this.#buttonsContainer);
  }

  #renderCards(bouquets, container) {
    bouquets.forEach((bouquet) => this.#renderCard(bouquet, container));
  }

  #renderCard(bouquet, container) {
    const cardPresenter = new CardPresenter(container);

    const openModal = () =>{
      this.#renderModal(bouquet, this.#bodyContainer);
      this.#modalPresenter.element.addEventListener('click', () => closeModal());
      document.addEventListener('keydown', this.#onEscKeyDown);
    }

    const closeModal = () => {
      this.#modalPresenter.destroy();
      document.removeEventListener('keydown', this.#onEscKeyDown);
    }

    cardPresenter.init(bouquet);

    cardPresenter.element.addEventListener('click', () => openModal());
  }

  #renderModal(bouquet, container) {
    this.#modalPresenter = new ModalPresenter(container);
    this.#modalPresenter.init(bouquet);
  }

  #renderCatalogue() {
    const bouquets = this.bouquets.slice(0, Math.min(this.bouquets.length, BOUQUET_COUNT_PER_STEP));

    render(this.#catalogueViewComponent, this.#mainContainer);
    render(this.#sortingViewComponent, this.#catalogueViewComponent.getSortingContainer());


    if (bouquets.length === 0) {
      render(this.#catalogueEmptyListViewComponent, this.#catalogueViewComponent.getBtnWrap(), RenderPosition.BEFOREBEGIN);
      this.#renderButtons(this.#buttonsContainer);
      return;
    }

    render(this.#catalogueListViewComponent, this.#buttonsContainer, RenderPosition.BEFOREBEGIN);

    this.#renderCardList(bouquets, this.#catalogueListViewComponent.element);
  }

  #onEscKeyDown = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      closeModal();
      document.removeEventListener('keydown', this.#onEscKeyDown);
    }
  }
}
