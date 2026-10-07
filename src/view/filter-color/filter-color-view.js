import AbstractView from '../../framework/view/abstract-view.js';

import {createFilterColorItemTemplate} from './filter-color-item-template.js';

const createFilterColorTemplate = (filters, currentColors, text) => {
  const colorItems = filters
    .map((type, index) =>
      createFilterColorItemTemplate(currentColors, type, text[type], index)
    )
    .join('');
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

/**
 * Отображает доступные цветовые фильтры и текущий набор выбранных цветов.
 * При событии change передаёт выбранный тип цвета Presenter-у;
 * правила сочетания цветов остаются в FilterModel.
 */
export default class FilterColorView extends AbstractView {
  #filters;
  #currentColors;
  #text;

  constructor(filters, currentColors, text) {
    super();
    this.#filters = filters;
    this.#currentColors = currentColors;
    this.#text = text;
  }

  get template() {
    return createFilterColorTemplate(this.#filters, this.#currentColors, this.#text);
  }

  setFilterTypeChangeHandler = (callback) => {
    this._callback.filterTypeChange = callback;
    this.element.addEventListener('change', this.#filterTypeChangeHandler);
  };

  #filterTypeChangeHandler = (evt) => {
    this._callback.filterTypeChange(evt.target.dataset.filterColor);
  };
}
