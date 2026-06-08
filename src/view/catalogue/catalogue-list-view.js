import AbstractView from '../../framework/view/abstract-view.js';

const createCatalogueListTemplate = () => `<ul class="catalogue__list"></ul>`;

export default class CatalogueListView extends AbstractView {
  get template() {
    return createCatalogueListTemplate();
  }
}
