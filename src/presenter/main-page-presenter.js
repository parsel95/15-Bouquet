import HeroView from '../view/hero/hero-view.js';
import MissionView from '../view/mission-view.js';
import AdvantagesView from '../view/advantages-view.js';

import CataloguePresenter from './catalogue-presenter.js';
import FilterReasonPresenter from './filter-reason-presenter.js';
import FilterColorPresenter from './filter-color-presenter.js';

import {render, remove} from '../framework/render.js';

export default class MainPagePresenter {
  #heroComponent = new HeroView();
  #missionComponent = new MissionView();
  #advantagesComponent = new AdvantagesView();

  #bodyContainer = null;
  #mainContainer = null;
  #bouquetsModel = null;
  #deferredModel = null;
  #filterModel = null;
  #savedCount = null;

  #cataloguePresenter = null;
  #filterReasonPresenter = null;
  #filterColorPresenter = null;

  constructor(bodyContainer, mainContainer, bouquetsModel, deferredModel, filterModel) {
    this.#bodyContainer = bodyContainer;
    this.#mainContainer = mainContainer;
    this.#bouquetsModel = bouquetsModel;
    this.#deferredModel = deferredModel;
    this.#filterModel = filterModel;
  }

  get selectedSortType() {
    return this.#cataloguePresenter.selectedSortType;
  }

  getBouquetsCount() {
    if (this.#cataloguePresenter) {
      return this.#cataloguePresenter.getRenderedBouquetsCount();
    }
    return null;
  }

  init(savedCount = null, shouldRestore = false, sortType) {
    this.#renderMainPage(savedCount, shouldRestore, sortType);
  }

  #renderStaticSections() {
    render(this.#heroComponent, this.#mainContainer);
    render(this.#missionComponent, this.#mainContainer);
    render(this.#advantagesComponent, this.#mainContainer);
  }

  #renderFiltersSections() {
    this.#filterReasonPresenter = new FilterReasonPresenter(this.#mainContainer, this.#filterModel);
    this.#filterReasonPresenter.init();

    this.#filterColorPresenter = new FilterColorPresenter(this.#mainContainer, this.#filterModel);
    this.#filterColorPresenter.init();
  }

  #renderCatalogue(savedCount, shouldRestore, sortType) {
    this.#cataloguePresenter = new CataloguePresenter(
      this.#bodyContainer,
      this.#mainContainer,
      this.#bouquetsModel,
      this.#deferredModel,
      this.#filterModel
    );

    if (shouldRestore) {
      this.#cataloguePresenter.currentSortType = sortType;
    }

    this.#cataloguePresenter.init(savedCount);
  }

  #renderMainPage(savedCount, shouldRestore, sortType) {
    this.#renderStaticSections();
    this.#renderFiltersSections();
    this.#renderCatalogue(savedCount, shouldRestore, sortType);
  }

  destroy() {
    remove(this.#heroComponent);
    remove(this.#missionComponent);
    remove(this.#advantagesComponent);

    this.#filterReasonPresenter.destroy();
    this.#filterColorPresenter.destroy();
    this.#cataloguePresenter.destroy();
  }
}

