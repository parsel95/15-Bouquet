import AbstractView from '../../framework/view/abstract-view.js';

const createDeferredContainerTemplate = () =>
  `
    <div class="popup-deferred__container">
      <a class="btn btn--with-icon popup-deferred__btn btn--light" href="#">в&nbsp;каталог
        <svg width="61" height="24" aria-hidden="true">
          <use xlink:href="#icon-arrow"></use>
        </svg>
      </a>

      <div class="popup-deferred__btn-container">
        <button class="btn btn--with-icon popup-deferred__btn-clean" type="button">очистить
          <svg width="61" height="24" aria-hidden="true">
            <use xlink:href="#icon-arrow"></use>
          </svg>
        </button>
      </div>
    </div>
  `;

export default class DeferredContainerView extends AbstractView {
  get template() {
    return createDeferredContainerTemplate();
  }

  getDeferredBackButton() {
    return this.element.querySelector('.popup-deferred__btn');
  }

  getDeferredCleanButton() {
    return this.element.querySelector('.popup-deferred__btn-clean');
  }
}
