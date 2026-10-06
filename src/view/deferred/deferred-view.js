import AbstractView from '../../framework/view/abstract-view.js';

const createDeferredTemplate = () =>
  `
    <div class="popup-deferred__wrapper">
      <div class="popup-deferred__container"></div>
    </div>
  `;

/**
 * Корневой View страницы отложенных букетов.
 * Предоставляет контейнер, в который Presenter собирает секции страницы.
 */
export default class DeferredView extends AbstractView {
  get template() {
    return createDeferredTemplate();
  }

  getDeferredContainer() {
    return this.element.querySelector('.popup-deferred__container');
  }
}
