import AbstractView from '../../framework/view/abstract-view.js';

const createCatalogueTemplate = () =>
  `
    <div class="catalogue" data-items="catalogue">
      <div class="container">
        <div class="catalogue__header">
          <h2 class="title title--h3 catalogue__title">Каталог</h2>
          <div class="catalogue__sorting" id="catalogue-sorting-container"></div>
        </div>
        <div class="catalogue__btn-wrap"></div>
      </div>
    </div>
  `;

export default class CatalogueView extends AbstractView {
  get template() {
    return createCatalogueTemplate();
  }

  getListContainer() {
    return this.element.querySelector('.container');
  }

  getSortingContainer() {
    return this.element.querySelector('.catalogue__sorting');
  }

  getBtnWrap() {
    return this.element.querySelector('.catalogue__btn-wrap');
  }

  scrollToStart() {
    this.getSortingContainer().scrollIntoView({behavior: 'smooth'});
  }
}
