import AbstractView from '../../framework/view/abstract-view.js';

const createCatalogueListLoadingTemplate = () =>
  `
    <p class="catalogue-loading">
      Загружаем букеты...
    </p>
  `;

export default class CatalogueListLoadingView extends AbstractView {
  get template() {
    return createCatalogueListLoadingTemplate();
  }
}
