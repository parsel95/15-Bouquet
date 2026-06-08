import AbstractView from '../../framework/view/abstract-view.js';
import {createFilterColorItemTemplate} from './filter-color-item-template.js';

const createFilterColorTemplate = (filters, currentColor, text) => {
  const colorItems = filters.map((type, index) =>
    createFilterColorItemTemplate(currentColor, type, text[type], index)).join('');
  return `
    <section class="filter-color">
      <div class="container">
        <h2 class="title title--h3 filter-color__title">Выберите основной цвет для букета</h2>
        <form class="filter-color__form" action="#" method="post">
          <div class="filter-color__form-fields" data-filter-color="filter">
            ${colorItems}
          </div>
          <button class="visually-hidden" type="submit" tabindex="-1">применить фильтр</button>
        </form>
      </div>
    </section>
  `;
};

export default class FilterColorView extends AbstractView {
  #filters = null;
  #currentColor = null;
  #text = null;

  constructor(filters, currentColor, text) {
    super();
    this.#filters = filters;
    this.#currentColor = currentColor;
    this.#text = text;
  }

  get template() {
    return createFilterColorTemplate(this.#filters, this.#currentColor, this.#text);
  }
}

