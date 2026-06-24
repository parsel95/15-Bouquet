import AbstractView from '../../framework/view/abstract-view.js';
import { createHeroMainTemplate } from './hero-main-template.js';
import { createHeroPopupTemplate } from './hero-popup-template.js';

const createHeroViewTemplate = ({isPopup}) =>
  `
    <section class="hero ${isPopup ? 'hero--popup' : ''}">
      <div class="hero__wrapper">
        ${isPopup ? createHeroPopupTemplate() : createHeroMainTemplate()}
      </div>
    </section>
  `;

export default class HeroView extends AbstractView {
  #isPopup = false;

  constructor({isPopup = false} = {}) {
    super();
    this.#isPopup = isPopup;
  }

  get template() {
    return createHeroViewTemplate({
      isPopup: this.#isPopup,
    });
  }

  setCloseClickHandler = (callback) => {
    this._callback.click = callback;
    this.element.querySelector('.btn-close').addEventListener('click', this.#closeClickHandler);
  }

  #closeClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.click();
  }
}
