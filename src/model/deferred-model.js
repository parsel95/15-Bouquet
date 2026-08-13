import Observable from '../framework/observable.js';
import {deferredBoquets} from '../mock/deferred-bouquets.js';

export default class DeferredModel extends Observable {
  #deferredBouquets = deferredBoquets;

  get = () => this.#deferredBouquets;

  has = (bouquetId) => {
    return Object.hasOwn(this.#deferredBouquets.products, bouquetId);
  }

  increment = (updateType, bouquet) => {
    if (this.has(bouquet.id)) {
      this.#deferredBouquets.products[bouquet.id]++;
    } else {
      this.#deferredBouquets.products[bouquet.id] = 1;
    }

    this._notify(updateType, bouquet);
  }

  decrement = (updateType, bouquet) => {
    if (this.#deferredBouquets.products[bouquet.id] > 1) {
      this.#deferredBouquets.products[bouquet.id]--;
    } else {
      delete this.#deferredBouquets.products[bouquet.id];
    }

    this._notify(updateType, bouquet);
  }

  cleanAll = (updateType) => {
    this.#deferredBouquets.products = {};
    this._notify(updateType);
  }

  add = (updateType, bouquet) => {
    this.#deferredBouquets.products[bouquet.id] = 1;
    this._notify(updateType, bouquet);
  }

  delete = (updateType, bouquet) => {
    delete this.#deferredBouquets.products[bouquet.id];
    this._notify(updateType, bouquet);
  }

  toggleFavorite = (updateType, bouquet) => {
    if (this.has(bouquet.id)) {
      this.delete(updateType, bouquet);
    } else {
      this.add(updateType, bouquet);
    }
  }
}
