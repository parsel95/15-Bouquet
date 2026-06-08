import AbstractView from '../../framework/view/abstract-view.js';

const createDeferredCatalogTemplate = () =>
  `
    <ul class="popup-deferred__catalog"></ul>
  `;

export default class DeferredCatalogView extends AbstractView {
  get template() {
    return createDeferredCatalogTemplate();
  }
}
