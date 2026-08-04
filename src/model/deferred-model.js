import Observable from '../framework/observable.js';
import {deferredBoquets} from '../mock/deferred-bouquets.js';

export default class DeferredModel extends Observable {
  #deferredBouquets = deferredBoquets;

  get = () => this.#deferredBouquets;

  has = (bouquetId) => {
    return Object.hasOwn(this.#deferredBouquets.products, bouquetId);
  }

  add = (bouquet, updateType) => {
    this.#deferredBouquets.products[bouquet.id] = 1;
  }

  delete = (bouquet) => {
    delete this.#deferredBouquets.products[bouquet.id];
  }

  toggleFavorite = (bouquet, updateType) => {
    if (this.has(bouquet.id)) {
      this.delete(bouquet);
    } else {
      this.add(bouquet, updateType);
    }

    this._notify(updateType, bouquet);
  }
}
