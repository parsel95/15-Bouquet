import DeferredCatalogItemView from '../view/deferred/deferred-catalog-item-view.js';
import {render, remove, replace} from '../framework/render.js';
import {UserAction, UpdateType} from '../const.js';

/**
 * Управляет карточкой букета на странице отложенных.
 *
 * Передаёт действия с количеством и удалением карточки
 * родительскому Presenter-у. Тип обновления зависит от операции:
 * PATCH обновляет существующую карточку, MINOR перестраивает список.
 */
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

    this.#cardComponent = new DeferredCatalogItemView(bouquet, count);

    this.#cardComponent.setCloseButtonClickHandler(this.#handleCloseBtnClick);
    this.#cardComponent.setDecrementClickHandler(
      () => this.#handleDecrementClick(count)
    );
    this.#cardComponent.setIncrementClickHandler(this.#handleIncrementClick);

    if (prevCardComponent === null) {
      render(this.#cardComponent, this.#container);
      return;
    }

    replace(this.#cardComponent, prevCardComponent);
    remove(prevCardComponent);
  }

  #handleDecrementClick = (count) => {
    const updateType = count === 1
      ? UpdateType.MINOR
      : UpdateType.PATCH;

    this.#changeData(
      UserAction.DECREMENT_DEFERRED,
      updateType,
      {...this.#bouquet}
    );
  };

  #handleIncrementClick = () => {
    this.#changeData(
      UserAction.INCREMENT_DEFERRED,
      UpdateType.PATCH,
      {...this.#bouquet}
    );
  };

  #handleCloseBtnClick = () => {
    this.#changeData(
      UserAction.REMOVE_DEFERRED_ITEM,
      UpdateType.MINOR,
      {...this.#bouquet}
    );
  };

  destroy() {
    remove(this.#cardComponent);
  }
}
