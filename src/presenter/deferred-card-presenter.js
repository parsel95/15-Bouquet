import DeferredCatalogItemView from '../view/deferred/deferred-catalog-item-view.js';
import {render, remove, replace} from '../framework/render.js';
import {UserAction, UpdateType} from '../const.js';

export default class DeferredCardPresenter {
  #cardComponent = null;

  #container = null;
  #deferredModel = null;

  #bouquet = null;

  #changeData = null;

  constructor(container, deferredModel, changeData) {
    this.#container = container;
    this.#deferredModel = deferredModel;
    this.#changeData = changeData;
  }

  init(bouquet, count) {
    this.#bouquet = bouquet;

    const prevCardComponent = this.#cardComponent;

    this.#cardComponent = new DeferredCatalogItemView(this.#bouquet, count);

    this.#cardComponent.setCloseBtnClickHandler(this.#handleCloseBtnClick);
    this.#cardComponent.setDecrementClickHandler(() => this.#handleDecrementClick(count));
    this.#cardComponent.setIncrementClickHandler(this.#handleIncrementClick);

    if (prevCardComponent === null) {
      render(this.#cardComponent, this.#container);
      return;
    }

    replace(this.#cardComponent, prevCardComponent);
    remove(prevCardComponent);
  }

  #handleDecrementClick = (count) => {
    if (count === 1) {
      this.#changeData(
        UserAction.DECREMENT_BOUQUET,
        UpdateType.MINOR,
        {...this.#bouquet}
      );
    } else {
      this.#changeData(
        UserAction.DECREMENT_BOUQUET,
        UpdateType.PATCH,
        {...this.#bouquet}
      );
    }
  }

  #handleIncrementClick = () => {
    this.#changeData(
      UserAction.INCREMENT_BOUQUET,
      UpdateType.PATCH,
      {...this.#bouquet}
    );
  }

  #handleCloseBtnClick = () => {
    this.#changeData(
      UserAction.DELETE_BOUQUET,
      UpdateType.MINOR,
      {...this.#bouquet}
    );
  }

  destroy() {
    remove(this.#cardComponent);
  }
}
