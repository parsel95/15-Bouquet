import FilterColorView from '../view/filter-color/filter-color-view';
import {render, remove, replace} from '../framework/render.js';
import {ColorType, ColorTypeText, UpdateType} from '../const.js';

export default class FilterColorPresenter {
  #container = null;
  #filterColorComponent = null;

  #currentColors = null;

  #filterModel = null;

  constructor(container, filterModel) {
    this.#container = container;
    this.#filterModel = filterModel;

    this.#filterModel.addObserver(this.#handleModelEvent);
  }

  get filters() {
    return Object.values(ColorType);
  }

  init() {
    this.#currentColors = this.#filterModel.colorFilters;

    const filters = this.filters;
    const text = ColorTypeText;

    const prevFilterColorComponent = this.#filterColorComponent;

    this.#filterColorComponent = new FilterColorView(filters, this.#currentColors, text);
    this.#filterColorComponent.setFilterTypeChangeHandler(this.#filterTypeChangeHandler);

    if (prevFilterColorComponent === null) {
      render(this.#filterColorComponent, this.#container);
      return;
    }

    replace(this.#filterColorComponent, prevFilterColorComponent);
    remove(prevFilterColorComponent);
  }

  #handleModelEvent = () => {
    this.init();
  }

  #filterTypeChangeHandler = (filterType) => {
    this.#filterModel.toggleColorFilter(UpdateType.MINOR, filterType);
  }

  destroy() {
    this.#filterModel.removeObserver(this.#handleModelEvent);
    remove(this.#filterColorComponent);
  }
}
