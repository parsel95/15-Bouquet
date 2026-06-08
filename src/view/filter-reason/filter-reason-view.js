import AbstractView from '../../framework/view/abstract-view.js';
import { createFilterReasonItemTemplate } from './filter-reason-item-template.js';

const createFilterReasonTemplate = (filters, currentReason, text) => {
  const reasonItems = filters.map((type, index) =>
    createFilterReasonItemTemplate(currentReason, type, text[type], index)).join('');
  return `
    <section class="filter-reason">
      <div class="container">
        <h2 class="title title--h3 filter-reason__title">Выберите повод для букета</h2>
        <form class="filter-reason__form" action="#" method="post">
          <div class="filter-reason__form-fields">
            ${reasonItems}
          </div>
          <button class="filter-reason__btn visually-hidden" type="submit" tabindex="-1">применить фильтр</button>
        </form>
      </div>
    </section>
  `;
};

export default class FilterReasonView extends AbstractView {
  #filters = null;
  #currentReason = null;
  #text = null;

  constructor(filters, currentReason, text) {
    super();
    this.#filters = filters;
    this.#currentReason = currentReason;
    this.#text = text;
  }

  get template() {
    return createFilterReasonTemplate(this.#filters, this.#currentReason, this.#text);
  }
}

