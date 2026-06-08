import {deferredBoquets} from '../mock/deferred-bouquets.js';

export default class DeferredModel {
  #deferredBouquets = deferredBoquets;

  get = () => this.#deferredBouquets;
}
