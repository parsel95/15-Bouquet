import HeaderCountView from '../view/header/header-count-view.js';

import {render} from '../framework/render.js';

export default class HeaderCountPresenter {
  #headerCountComponent = null;

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
    this.#headerCountComponent = new HeaderCountView(this.deferred);

    render(this.#headerCountComponent, this.#container);
    this.#headerCountComponent.setClickHandler(this.#handleOpenDeferred);
  }
}
