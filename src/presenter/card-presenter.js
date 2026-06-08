import CardView from '../view/card/card-view.js';
import {render} from '../framework/render.js';

export default class CardPresenter {
  #container = null;
  #cardViewComponent = null;
  #bouquet = null;

  constructor(container) {
    this.#container = container;
  }

  get element() {
    return this.#cardViewComponent.element;
  }

  init = (bouquet) => {
    this.#bouquet = bouquet;

    this.#cardViewComponent = new CardView(this.#bouquet);

    render(this.#cardViewComponent, this.#container);
  }
}
