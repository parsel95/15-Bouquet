import ModalView from '../view/modal/modal-view.js';
import {render, remove, replace} from '../framework/render.js';
import {UserAction, UpdateType} from '../const.js';

/**
 * Управляет модальным окном с информацией о букете.
 *
 * Presenter отвечает за жизненный цикл модального окна:
 * создание View, её обновление при смене букета
 * и корректное уничтожение при закрытии.
 *
 * Сам Presenter не управляет DOM напрямую — для этого
 * используются render(), replace() и remove().
 */
export default class ModalPresenter {
  #modalComponent = null;

  #container = null;
  #deferredModel = null;

  #bouquet = null;

  #changeData = null;
  #handleCloseModal = null;

  constructor(container, deferredModel, changeData, handleCloseModal) {
    this.#container = container;
    this.#deferredModel = deferredModel;
    this.#changeData = changeData;
    this.#handleCloseModal = handleCloseModal;
  }

  /**
   * Показывает модальное окно для переданного букета.
   *
   * При первом открытии создаёт View и инициализирует слайдер.
   * При смене букета уничтожает ресурсы старого View,
   * заменяет его новым и инициализирует новый слайдер.
   *
   * @param {Object} bouquet Данные букета для отображения.
   */
  init(bouquet) {
    this.#bouquet = bouquet;

    const prevModalComponent = this.#modalComponent;
    const isDeferred = this.#deferredModel.has(bouquet.id);

    this.#modalComponent = new ModalView(bouquet, isDeferred);

    this.#modalComponent.setCloseClickHandler(this.#handleCloseModal);
    this.#modalComponent.setDeferredClickHandler(this.#handleDeferredClick);

    if (prevModalComponent === null) {
      render(this.#modalComponent, this.#container);
      this.#modalComponent.initSlider();
      return;
    }

    prevModalComponent.destroy();

    replace(this.#modalComponent, prevModalComponent);
    this.#modalComponent.initSlider();

    remove(prevModalComponent);
  }

  #handleDeferredClick = () => {
    this.#changeData(
      UserAction.TOGGLE_DEFERRED,
      UpdateType.PATCH,
      {...this.#bouquet}
    );
  };

  modalElement() {
    return this.#modalComponent.element;
  }

  updateDeferredStatus() {
    const isDeferred = this.#deferredModel.has(this.#bouquet.id);
    this.#modalComponent.updateDeferredStatus(isDeferred);
  }

  /**
   * Закрывает модальное окно и освобождает связанные ресурсы.
   *
   * Сначала View уничтожает свои дочерние ресурсы
   * (например, экземпляр Swiper), после чего сам View
   * удаляется из DOM.
   */
  destroy() {
    this.#modalComponent.destroy();
    remove(this.#modalComponent);
  }
}
