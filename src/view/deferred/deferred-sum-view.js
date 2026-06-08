import AbstractView from '../../framework/view/abstract-view.js';

const createDeferredSumTemplate = ({productCount, sum}) =>
  `
    <div class="popup-deferred__sum">
      <p class="text text--total">Итого вы выбрали:</p>
      <div class="popup-deferred__block-wrap">
        <div class="popup-deferred__block">
          <p class="text text--total">Букеты</p><span class="popup-deferred__count" data-atribute="count-defer">${productCount}</span>
        </div>
        <div class="popup-deferred__block">
          <p class="text text--total">Сумма</p><b class="price price--size-middle-p">${sum}<span>Р</span></b>
        </div>
      </div>
    </div>
  `;

export default class DeferredSumView extends AbstractView {
  #deferredBouquets = null;

  constructor(deferredBouquets) {
    super();
    this.#deferredBouquets = deferredBouquets;
  }

  get template() {
    return createDeferredSumTemplate(this.#deferredBouquets);
  }
}

