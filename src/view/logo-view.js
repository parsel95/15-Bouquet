import AbstractView from '../framework/view/abstract-view.js';

import {LogoConfig} from '../const.js';

const createLogoViewTemplate = (config) =>
  `
    <a class="logo__link" aria-label="Логотип">
      <svg
        width="${config.width}"
        height="${config.height}"
        aria-hidden="true"
      >
        <use xlink:href="#icon-logo"></use>
      </svg>
    </a>
  `;


export default class LogoView extends AbstractView {
  #config = null;

  constructor(type = 'HEADER') {
    super();
    this.#config = LogoConfig[type];
  }

  get template() {
    return createLogoViewTemplate(this.#config);
  }

  setClickHandler = (callback) => {
    this._callback.click = callback;

    this.element.addEventListener('click', this.#clickHandler);
  }

  #clickHandler = (evt) => {
    evt.preventDefault();
    this._callback.click();
  }
}


