import HeaderView from '../view/header/header-view.js';
import FooterView from '../view/footer-view.js';
import LogoView from '../view/logo-view.js';

import MainPagePresenter from './main-page-presenter.js';
import HeaderCountPresenter from './header-count-presenter.js';
import DeferredPresenter from './deferred-presenter.js';

import {render, RenderPosition} from '../framework/render.js';
import {setToZeroOpacity, setToFullOpacity} from '../utils/animation.js';
import {logoParentName, Page} from '../const.js';

const PAGE_TRANSITION_TIME = 400;

/**
 * Управляет общими элементами приложения и жизненным циклом страниц.
 *
 * Перед уходом с каталога сохраняет позицию прокрутки, число показанных
 * букетов и выбранную сортировку. При возврате по запросу передаёт эти
 * значения новому MainPagePresenter для восстановления состояния каталога.
 */
export default class AppPresenter {
  #headerComponent = new HeaderView();
  #footerComponent = new FooterView();
  #logoHeaderComponent = new LogoView();
  #logoFooterComponent = new LogoView(logoParentName);

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
  #savedSortType = null;
  #isSwitchingPage = false;

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
    render(this.#headerComponent, this.#wrapperContainer, RenderPosition.AFTERBEGIN);
    render(this.#logoHeaderComponent, this.#headerComponent.logoContainer);
    this.#logoHeaderComponent.setClickHandler(() => this.#switchPage(Page.MAIN));

    this.#headerCountPresenter = new HeaderCountPresenter(
      this.#headerComponent.headerContainer,
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

    render(this.#footerComponent, this.#wrapperContainer);
    render(this.#logoFooterComponent, this.#footerComponent.logoContainer);
    this.#logoFooterComponent.setClickHandler(() => this.#switchPage(Page.MAIN));
  }

  #destroyCurrentPage() {
    this.#mainPagePresenter?.destroy();
    this.#deferredPresenter?.destroy();

    this.#mainPagePresenter = null;
    this.#deferredPresenter = null;
  }

  #renderMainPage(shouldRestore) {
    this.#mainPagePresenter = new MainPagePresenter(
      this.#bodyContainer,
      this.#mainContainer,
      this.#bouquetsModel,
      this.#deferredModel,
      this.#filterModel
    );

    if (shouldRestore) {
      this.#mainPagePresenter.init(
        this.#renderedBouquetsCount,
        true,
        this.#savedSortType
      );

      window.scrollTo(0, this.#mainScrollPosition);
      return;
    }

    this.#filterModel.resetFilters();
    this.#mainPagePresenter.init();
  }

  #renderDeferredPage() {
    this.#deferredPresenter = new DeferredPresenter(
      this.#mainContainer,
      this.#bodyContainer,
      this.#bouquetsModel,
      this.#deferredModel,
      () => this.#switchPage(Page.MAIN),
      () => this.#switchPage(Page.MAIN, true)
    );

    this.#deferredPresenter.init();
  }

  /**
   * Переключает страницу с задержкой для анимации смены содержимого.
   *
   * Пока переход выполняется, повторные вызовы игнорируются. Состояние
   * каталога сохраняется до уничтожения его Presenter-а.
   *
   * @param {string} targetPage Страница, которую нужно показать.
   * @param {boolean} [shouldRestore=false] Нужно ли восстановить каталог.
   */
  #switchPage = (targetPage, shouldRestore = false) => {
    if (this.#isSwitchingPage) {
      return;
    }

    if (targetPage === Page.MAIN && this.#mainPagePresenter) {
      return;
    }
    if (targetPage === Page.DEFERRED && this.#deferredPresenter) {
      return;
    }

    if (this.#mainPagePresenter) {
      this.#mainScrollPosition = window.scrollY;
      this.#renderedBouquetsCount = this.#mainPagePresenter.getRenderedBouquetsCount();
      this.#savedSortType = this.#mainPagePresenter.currentSortType;
    }

    window.scrollTo(0, 0);

    this.#isSwitchingPage = true;
    setToZeroOpacity(this.#mainContainer, 0.5);

    setTimeout(() => {
      this.#destroyCurrentPage();

      if (targetPage === Page.MAIN) {
        this.#renderMainPage(shouldRestore);
      } else if (targetPage === Page.DEFERRED) {
        this.#renderDeferredPage();
      }

      this.#isSwitchingPage = false;
      setToFullOpacity(this.#mainContainer);
    }, PAGE_TRANSITION_TIME);
  };
}
