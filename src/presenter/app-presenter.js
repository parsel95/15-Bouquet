import HeaderView from '../view/header/header-view.js';
import FooterView from '../view/footer-view.js';
import LogoView from '../view/logo-view.js';

import MainPagePresenter from'./main-page-presenter.js';
import HeaderCountPresenter from './header-count-presenter.js';
import DeferredPresenter from './deferred-presenter.js';

import {render, RenderPosition} from '../framework/render.js';
import {setToZeroOpacity, setToFullOpacity} from '../utils/animation.js';
import {logoParentName, Page} from '../const.js';

export default class AppPresenter {
  #headerViewComponent = new HeaderView();
  #footerViewComponent = new FooterView();
  #logoHeaderViewComponent = new LogoView();
  #logoFooterViewComponent = new LogoView(logoParentName);

  #bodyContainer = null;
  #wrapperContainer = null;
  #mainContainer = null;
  #bouquetsModel = null;
  #deferredModel = null;
  #filterModel = null;

  #headerCountPresenter = null;
  #mainPagePresenter = null;
  #deferredPresenter = null;

  #mainScrollPosition = null;
  #renderedBouquetsCount = null;

  constructor(
    bodyContainer,
    wrapperContainer,
    mainContainer,
    bouquetsModel,
    deferredModel,
    filterModel
  ) {
    this.#bodyContainer = bodyContainer;
    this.#wrapperContainer = wrapperContainer;
    this.#mainContainer = mainContainer;
    this.#bouquetsModel = bouquetsModel;
    this.#deferredModel = deferredModel;
    this.#filterModel = filterModel;
  }

  init() {
    render(this.#headerViewComponent, this.#wrapperContainer, RenderPosition.AFTERBEGIN);
    render(this.#logoHeaderViewComponent, this.#headerViewComponent.logoContainer);
    this.#logoHeaderViewComponent.setClickHandler(() => this.#switchPage(Page.MAIN));

    this.#headerCountPresenter = new HeaderCountPresenter(
      this.#headerViewComponent.headerContainer,
      this.#bodyContainer,
      this.#bouquetsModel,
      this.#deferredModel,
      () => this.#switchPage(Page.DEFERRED)
    );
    this.#headerCountPresenter.init();

    this.#mainPagePresenter = new MainPagePresenter(
      this.#bodyContainer,
      this.#mainContainer,
      this.#bouquetsModel,
      this.#deferredModel,
      this.#filterModel
    );
    this.#mainPagePresenter.init(this.#renderedBouquetsCount);

    render(this.#footerViewComponent, this.#wrapperContainer);
    render(this.#logoFooterViewComponent, this.#footerViewComponent.logoContainer);
    this.#logoFooterViewComponent.setClickHandler(() => this.#switchPage(Page.MAIN));
  }

  #switchPage = (targetPage, shouldRestore = false, time = 500) => {
    if (this.#mainPagePresenter) {
      this.#mainScrollPosition = window.scrollY;
      this.#renderedBouquetsCount = this.#mainPagePresenter.getBouquetsCount();
    }

    window.scrollTo(0, 0);

    if (targetPage === Page.MAIN && this.#mainPagePresenter) return;
    if (targetPage === Page.DEFERRED && this.#deferredPresenter) return;

    setToZeroOpacity(this.#mainContainer, 0.5);

    setTimeout(() => {
      if (this.#mainPagePresenter) {
        this.#mainPagePresenter.destroy();
        this.#mainPagePresenter = null;
      }
      if (this.#deferredPresenter) {
        this.#deferredPresenter.destroy();
        this.#deferredPresenter = null;
      }

      if (targetPage === Page.MAIN) {
        this.#mainPagePresenter = new MainPagePresenter(
          this.#bodyContainer,
          this.#mainContainer,
          this.#bouquetsModel,
          this.#deferredModel,
          this.#filterModel
        );

        if (shouldRestore) {
          this.#mainPagePresenter.init(this.#renderedBouquetsCount);
          window.scrollTo(0, this.#mainScrollPosition);
        } else {
          this.#mainPagePresenter.init();
        }
      } else if (targetPage === Page.DEFERRED) {
        this.#deferredPresenter = new DeferredPresenter(
          this.#mainContainer,
          this.#bouquetsModel,
          this.#deferredModel,
          () => this.#switchPage(Page.MAIN),
          () => this.#switchPage(Page.MAIN, true)
        );
        this.#deferredPresenter.init();
      }

      setToFullOpacity(this.#mainContainer);
    }, time);
  }
}
