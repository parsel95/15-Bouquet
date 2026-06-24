import HeaderCountView from '../view/header/header-count-view.js';

import {render} from '../framework/render.js';

export default class HeaderCountPresenter {
  #headerCountViewComponent = null;

  #container = null;
  #bodyContainer = null;
  #bouquetsModel = null;
  #deferredModel = null;

  #handleOpenDeferred = null;

  constructor(container, bodyContainer, bouquetsModel, deferredModel, handleOpenDeferred) {
    this.#container = container;
    this.#bodyContainer = bodyContainer;
    this.#bouquetsModel = bouquetsModel;
    this.#deferredModel = deferredModel;
    this.#handleOpenDeferred = handleOpenDeferred;
  }

  get deferred() {
    return this.#deferredModel.get();
  }

  init() {
    this.#renderHeaderCount();
  }

  #renderHeaderCount() {
    this.#headerCountViewComponent = new HeaderCountView(this.deferred);

    render(this.#headerCountViewComponent, this.#container);
    this.#headerCountViewComponent.setClickHandler(this.#handleOpenDeferred);
  }
}
