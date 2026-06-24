import HeroView from '../view/hero/hero-view.js';
import MissionView from '../view/mission-view.js';
import AdvantagesView from '../view/advantages-view.js';

import CataloguePresenter from './catalogue-presenter.js';
import FilterReasonPresenter from './filter-reason-presenter.js';
import FilterColorPresenter from './filter-color-presenter.js';
import DeferredPresenter from './deferred-presenter.js';

import {render, remove} from '../framework/render.js';
import {ReasonType, ColorType} from '../const.js';

export default class MainPagePresenter {
  #heroViewComponent = new HeroView();
  #missionViewComponent = new MissionView();
  #advantagesViewComponent = new AdvantagesView();

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

  getBouquetsCount() {
    if (this.#cataloguePresenter) {
      return this.#cataloguePresenter.getRenderedBouquetsCount();
    }
    return null;
  }

  init(savedCount = null) {
    this.#renderMainPage(savedCount);
  }

  #renderStaticSections() {
    render(this.#heroViewComponent, this.#mainContainer);
    render(this.#missionViewComponent, this.#mainContainer);
    render(this.#advantagesViewComponent, this.#mainContainer);
  }

  #renderFiltersSections() {
    this.#filterReasonPresenter = new FilterReasonPresenter(this.#mainContainer, this.#filterModel);
    this.#filterReasonPresenter.init();

    this.#filterColorPresenter = new FilterColorPresenter(this.#mainContainer, this.#filterModel);
    this.#filterColorPresenter.init();
  }

  #renderCatalogue(savedCount) {
    this.#cataloguePresenter = new CataloguePresenter(this.#bodyContainer, this.#mainContainer, this.#bouquetsModel, this.#deferredModel);
    console.log(this.#savedCount);
    this.#cataloguePresenter.init(savedCount);
  }

  #renderMainPage(savedCount) {
    this.#renderStaticSections();
    this.#renderFiltersSections();
    this.#renderCatalogue(savedCount);
  }

  destroy() {
    remove(this.#heroViewComponent);
    remove(this.#missionViewComponent);
    remove(this.#advantagesViewComponent);

    this.#filterReasonPresenter.destroy();
    this.#filterColorPresenter.destroy();
    this.#cataloguePresenter.destroy();
  }
}

