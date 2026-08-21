import FilterReasonView from '../view/filter-reason/filter-reason-view.js';
import {render, remove, replace} from '../framework/render.js';
import {ReasonType, ReasonTypeText, UpdateType} from '../const.js';

export default class FilterReasonPresenter {
  #container = null;
  #filterReasonComponent = null;

  #currentReason = null;

  #filterModel = null;

  constructor(container, filterModel) {
    this.#container = container;
    this.#filterModel = filterModel;

    this.#filterModel.addObserver(this.#handleModelEvent);
  }

  get filters() {
    return Object.values(ReasonType);
  }

  init() {
    this.#currentReason = this.#filterModel.reasonFilter;

    const filters = this.filters;
    const text = ReasonTypeText;

    const prevFilterReasonComponent = this.#filterReasonComponent;

    this.#filterReasonComponent = new FilterReasonView(filters, this.#currentReason, text);
    this.#filterReasonComponent.setFilterTypeChangeHandler(this.#filterTypeChangeHandler);

    if (prevFilterReasonComponent === null) {
      render(this.#filterReasonComponent, this.#container);
      return;
    }

    replace(this.#filterReasonComponent, prevFilterReasonComponent);
    remove(prevFilterReasonComponent);
  }

  #handleModelEvent = () => {
    this.init();
  }

  #filterTypeChangeHandler = (filterType) => {
    if (this.#filterModel.reasonFilter === filterType) {
      return;
    }

    this.#filterModel.setReasonFilter(UpdateType.MINOR, filterType);
  }

  destroy() {
    this.#filterModel.removeObserver(this.#handleModelEvent);
    remove(this.#filterReasonComponent);
  }
}
