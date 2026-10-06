import CardView from '../view/card/card-view.js';
import {render, remove, replace} from '../framework/render.js';
import {UserAction, UpdateType} from '../const.js';

/**
 * Управляет одной карточкой каталога.
 *
 * Передаёт открытие букета и переключение его статуса в отложенных
 * родительскому Presenter-у, а при обновлении данных заменяет View карточки.
 */
export default class CatalogueCardPresenter {
  #cardComponent = null;

  #container = null;
  #deferredModel = null;

  #bouquet = null;

  #changeData = null;
  #clickCardHandler = null;

  constructor(container, deferredModel, changeData, clickCardHandler) {
    this.#container = container;
    this.#deferredModel = deferredModel;
    this.#changeData = changeData;
    this.#clickCardHandler = clickCardHandler;
  }

  init(bouquet) {
    this.#bouquet = bouquet;

    const prevCardComponent = this.#cardComponent;

    const isDeferred = this.#deferredModel.has(bouquet.id);
    this.#cardComponent = new CardView(this.#bouquet, isDeferred);

    this.#cardComponent.setOpenClickHandler(() => {
      this.#clickCardHandler(this.#bouquet);
    });
    this.#cardComponent.setDeferredClickHandler(this.#handleDeferredClick);

    if (prevCardComponent === null) {
      render(this.#cardComponent, this.#container);
      return;
    }

    replace(this.#cardComponent, prevCardComponent);
    remove(prevCardComponent);
  }

  #handleDeferredClick = () => {
    this.#changeData(
      UserAction.TOGGLE_DEFERRED,
      UpdateType.PATCH,
      {...this.#bouquet}
    );
  };

  destroy() {
    remove(this.#cardComponent);
  }
}
