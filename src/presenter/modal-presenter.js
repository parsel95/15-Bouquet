import ModalView from '../view/modal/modal-view.js';
import {render, remove, replace} from '../framework/render.js';
import {UserAction, UpdateType} from '../const.js';

export default class ModalPresenter {
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
   * При первом открытии создаётся новый ModalView.
   * При смене букета существующее представление заменяется,
   * после чего для нового View повторно инициализируется слайдер.
   *
   * @param {Object} bouquet Данные букета для отображения.
   */
  init(bouquet) {
    this.#bouquet = bouquet;

    const prevModalComponent = this.#modalComponent;

    const isDeferred = this.#deferredModel.has(bouquet.id);
    this.#modalComponent = new ModalView(this.#bouquet, isDeferred);

    this.#modalComponent.setCloseClickHandler(this.#handleCloseModal);
    this.#modalComponent.setDeferredClickHandler(this.#handleDeferredClick);

    if (prevModalComponent === null) {
      render(this.#modalComponent, this.#container);
      this.#modalComponent.initSlider();
      return;
    }

    replace(this.#modalComponent, prevModalComponent);

    // Swiper работает с конкретным DOM-элементом,
    // поэтому после замены View его нужно инициализировать заново.
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
