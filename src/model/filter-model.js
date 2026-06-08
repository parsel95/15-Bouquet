import {ReasonType, ColorType} from '../const.js';

export default class FilterModel {
  #reason = ReasonType.ALL;
  #color = ColorType.ALL;

  constructor() {
    this.#reason = ReasonType.ALL;
    this.#color = ColorType.ALL;
  }

  get reason() {
    return this.#reason;
  }

  get color() {
    return this.#color;
  }

  setReason(reason) {
    this.#reason = reason;
  }

  setColor(color) {
    this.#color = color;
  }
}
