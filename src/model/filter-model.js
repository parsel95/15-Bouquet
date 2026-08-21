import Observable from '../framework/observable.js';
import {ReasonType, ColorType} from '../const.js';

export default class FilterModel extends Observable {
  #reasonFilter = ReasonType.ALL;
  #colorFilters = [ColorType.ALL];

  get reasonFilter() {
    return this.#reasonFilter;
  }

  get colorFilters() {
    return [...this.#colorFilters];
  }

  setReasonFilter = (updateType, reasonFilter) => {
    if (this.#reasonFilter === reasonFilter) {
      return;
    }

    this.#reasonFilter = reasonFilter;
    this._notify(updateType, reasonFilter);
  }

  #addColorFilter = (colorFilter) => {
    this.#colorFilters.push(colorFilter);
  }

  #deleteColorFilter = (colorFilter) => {
    this.#colorFilters = this.#colorFilters.filter((filter) => filter !== colorFilter);
  }

  toggleColorFilter = (updateType, colorFilter) => {
    if (colorFilter === ColorType.ALL) {
      if (!this.#colorFilters.includes(ColorType.ALL)) {
        this.#colorFilters = [ColorType.ALL];
      }

      this._notify(updateType, colorFilter);
      return;
    }

    if (this.#colorFilters.includes(ColorType.ALL)) {
      this.#deleteColorFilter(ColorType.ALL);
    }

    this.#toggleColorInSelection(colorFilter);
    this._notify(updateType, colorFilter);
  }

  #toggleColorInSelection = (colorFilter) => {
    if (!this.#colorFilters.includes(colorFilter)) {
      this.#addColorFilter(colorFilter);
    } else {
      this.#deleteColorFilter(colorFilter);
    }

    if (this.#colorFilters.length === 0) {
      this.#addColorFilter(ColorType.ALL);
    }
  }
}
