import {deferredBoquets} from '../mock/deferred-bouquets.js';

export default class DeferredModel {
  #deferredBouquets = deferredBoquets;

  get = () => this.#deferredBouquets;

  has = (bouquetId) => {
    return Object.hasOwn(this.#deferredBouquets.products, bouquetId);
  }

  add = (bouquet) => {
    this.#deferredBouquets.products[bouquet.id] = 1;
  }

  delete = (bouquet) => {
    delete this.#deferredBouquets.products[bouquet.id];
  }

  toggleFavorite = (bouquet) => {
    if (this.has(bouquet.id)) {
      this.delete(bouquet);
    } else {
      this.add(bouquet);
    }
  }
}
