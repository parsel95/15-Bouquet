import AbstractView from '../../framework/view/abstract-view';

const createNoBouquetsTemplate = () => (
  `<p class="catalogue-loading">
    Загружаем букеты...
  </p>`
);

export default class CatalogueListLoadingView extends AbstractView {
  get template() {
    return createNoBouquetsTemplate();
  }
}
