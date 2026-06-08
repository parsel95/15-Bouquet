import HeroView from '../view/hero/hero-view.js';
import MissionView from '../view/mission-view.js';
import AdvantagesView from '../view/advantages-view.js';

import HeaderCountPresenter from './header-count-presenter.js';
import CataloguePresentor from './catalogue-presenter.js';
import FilterReasonPresenter from './filter-reason-presenter.js';
import FilterColorPresenter from './filter-color-presenter.js';

import {render} from '../framework/render.js';
import {ReasonType, ColorType} from '../const.js';

export default class PagePresentor {
  #heroViewComponent = new HeroView();
  #missionViewComponent = new MissionView();
  #advantagesViewComponent = new AdvantagesView();

  #mainContainer = null;
  #bodyContainer = null;
  #headerContainer = null;
  #deferredModel = null;
  #bouquetsModel = null;
  #filterModel = null;

  #headerCountPresenter = null;
  #cataloguePresentor = null;
  #filterReasonPresenter = null;
  #filterColorPresenter = null;

  constructor(mainContainer, bodyContainer, headerContainer, deferredModel, bouquetsModel, filterModel) {
    this.#mainContainer = mainContainer;
    this.#bodyContainer = bodyContainer;
    this.#headerContainer = headerContainer;
    this.#deferredModel = deferredModel;
    this.#bouquetsModel = bouquetsModel;
    this.#filterModel = filterModel;
  }

  init() {
    this.#headerCountPresenter = new HeaderCountPresenter(this.#headerContainer, this.#deferredModel);
    this.#headerCountPresenter.init();

    render(this.#heroViewComponent, this.#mainContainer);
    render(this.#missionViewComponent, this.#mainContainer);
    render(this.#advantagesViewComponent, this.#mainContainer);

    this.#filterReasonPresenter = new FilterReasonPresenter(this.#mainContainer, this.#filterModel);
    this.#filterReasonPresenter.init();

    this.#filterColorPresenter = new FilterColorPresenter(this.#mainContainer, this.#filterModel);
    this.#filterColorPresenter.init();

    this.#cataloguePresentor = new CataloguePresentor(this.#mainContainer, this.#bodyContainer, this.#bouquetsModel);
    this.#cataloguePresentor.init();
  }
}

