import HeaderCountView from '../view/header-count-view.js';

import {render} from '../framework/render.js';

export default class HeaderCountPresenter {
  #headerCountViewComponent = null;

  #container = null;
  #deferredModel = null;

  constructor(container, deferredModel) {
    this.#container = container;
    this.#deferredModel = deferredModel;
  }

  get deferred() {
    return this.#deferredModel.get();
  }

  init() {
    this.#headerCountViewComponent = new HeaderCountView(this.deferred);
    render(this.#headerCountViewComponent, this.#container);
  }
}
