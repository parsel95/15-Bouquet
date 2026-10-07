import FilterReasonView from '../view/filter-reason/filter-reason-view.js';

import {render, remove, replace} from '../framework/render.js';
import {ReasonType, ReasonTypeText, UpdateType} from '../const.js';

/**
 * Связывает выбор повода в интерфейсе с состоянием FilterModel.
 * По уведомлению модели обновляет View выбранного фильтра.
 */
export default class FilterReasonPresenter {
  #container = null;
  #filterReasonComponent = null;

  #filterModel = null;

  constructor(container, filterModel) {
    this.#container = container;
    this.#filterModel = filterModel;

    this.#filterModel.addObserver(this.#handleModelEvent);
  }

  init() {
    const currentReason = this.#filterModel.reasonFilter;
    const filters = Object.values(ReasonType);
    const text = ReasonTypeText;

    const prevFilterReasonComponent = this.#filterReasonComponent;

    this.#filterReasonComponent = new FilterReasonView(
      filters,
      currentReason,
      text
    );
    this.#filterReasonComponent.setFilterTypeChangeHandler(
      this.#filterTypeChangeHandler
    );

    if (prevFilterReasonComponent === null) {
      render(this.#filterReasonComponent, this.#container);
      return;
    }

    replace(this.#filterReasonComponent, prevFilterReasonComponent);
    remove(prevFilterReasonComponent);
  }

  #handleModelEvent = () => {
    this.init();
  };

  #filterTypeChangeHandler = (filterType) => {
    this.#filterModel.setReasonFilter(UpdateType.MINOR, filterType);
  };

  destroy() {
    this.#filterModel.removeObserver(this.#handleModelEvent);
    remove(this.#filterReasonComponent);
  }
}
