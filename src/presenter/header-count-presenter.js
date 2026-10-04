import HeaderCountView from '../view/header/header-count-view.js';

import {render, remove, replace} from '../framework/render.js';

export default class HeaderCountPresenter {
  #headerCountComponent = null;

  #container = null;
  #deferredModel = null;

  #handleOpenDeferred = null;

  constructor(container, deferredModel, handleOpenDeferred) {
    this.#container = container;
    this.#deferredModel = deferredModel;
    this.#handleOpenDeferred = handleOpenDeferred;

    this.#deferredModel.addObserver(this.#handleModelEvent);
  }

  get deferred() {
    return this.#deferredModel.get();
  }

  init() {
    this.#renderHeaderCount();
  }

  #handleModelEvent = () => {
    const prevComponent = this.#headerCountComponent;

    this.#headerCountComponent = new HeaderCountView(this.deferred);
    this.#headerCountComponent.setClickHandler(this.#handleOpenDeferred);

    replace(this.#headerCountComponent, prevComponent);
    remove(prevComponent);
  };

  #renderHeaderCount() {
    if (!this.#headerCountComponent) {
      this.#headerCountComponent = new HeaderCountView(this.deferred);
      render(this.#headerCountComponent, this.#container);
      this.#headerCountComponent.setClickHandler(this.#handleOpenDeferred);
    }
  }

  destroy() {
    this.#deferredModel.removeObserver(this.#handleModelEvent);
    remove(this.#headerCountComponent);
  }
}
