import FilterReasonView from '../view/filter-reason/filter-reason-view.js';
import {render, remove} from '../framework/render.js';
import {ReasonType, ReasonTypeText} from '../const.js';

export default class FilterReasonPresenter {
  #container = null;
  #filterReasonComponent = null;

  #currentReason = null;

  #filterModel = null;

  constructor(container, filterModel) {
    this.#container = container;
    this.#filterModel = filterModel;
  }

  get filters() {
    return Object.values(ReasonType);
  }

  init() {
    this.#currentReason = this.#filterModel.reason;

    const filters = this.filters;
    const text = ReasonTypeText;

    this.#filterReasonComponent = new FilterReasonView(filters, this.#currentReason, text);
    render(this.#filterReasonComponent, this.#container);
  }

  destroy() {
    remove(this.#filterReasonComponent);
  }
}
