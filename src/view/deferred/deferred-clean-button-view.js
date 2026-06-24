import AbstractView from '../../framework/view/abstract-view.js';

const createDeferredCleanButtonTemplate = () =>
  `
    <button class="btn btn--with-icon popup-deferred__btn-clean" type="button">очистить
      <svg width="61" height="24" aria-hidden="true">
        <use xlink:href="#icon-arrow"></use>
      </svg>
    </button>
  `;

export default class DeferredCleanButtonView extends AbstractView {
  get template() {
    return createDeferredCleanButtonTemplate();
  }
}
