import FilterColorView from '../view/filter-color/filter-color-view';
import {render} from '../framework/render.js';
import {ColorType, ColorTypeText} from '../const.js';

export default class FilterColorPresenter {
  #container = null;
  #filterColorComponent = null;

  #currentColor = null;

  #filterModel = null;

  constructor(container, filterModel) {
    this.#container = container;
    this.#filterModel = filterModel;
  }

  get filters() {
    return Object.values(ColorType);
  }

  init() {
    this.#currentColor = this.#filterModel.color;

    const filters = this.filters;
    const text = ColorTypeText;

    this.#filterColorComponent = new FilterColorView(filters, this.#currentColor, text);
    render(this.#filterColorComponent, this.#container);
  }
}
