import HeaderCountView from '../view/header/header-count-view.js';

import {render, remove, replace} from '../framework/render.js';

/**
 * Показывает количество отложенных букетов в шапке.
 *
 * Подписывается на DeferredModel и заменяет View при уведомлении модели.
 * При уничтожении Presenter снимает подписку и удаляет View.
 */
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
    if (!this.#headerCountComponent) {
      this.#headerCountComponent = new HeaderCountView(this.deferred);
      render(this.#headerCountComponent, this.#container);
      this.#headerCountComponent.setClickHandler(this.#handleOpenDeferred);
    }
  }

  #handleModelEvent = () => {
    const prevComponent = this.#headerCountComponent;

    this.#headerCountComponent = new HeaderCountView(this.deferred);
    this.#headerCountComponent.setClickHandler(this.#handleOpenDeferred);

    replace(this.#headerCountComponent, prevComponent);
    remove(prevComponent);
  };

  destroy() {
    this.#deferredModel.removeObserver(this.#handleModelEvent);
    remove(this.#headerCountComponent);
  }
}
