import {generateBouquet} from '../mock/bouquet.js';

export default class BouquetsModel {
  #bouquets = Array.from({length: 13}, generateBouquet);

  get = () => this.#bouquets;
}
