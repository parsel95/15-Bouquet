import Observable from '../framework/observable';
import {UpdateType} from '../const.js';

export default class BouquetsModel extends Observable {
  #bouquets = [];
  #apiService = null;

  constructor(apiService) {
    super();
    this.#apiService = apiService;
  }

  init = async () => {
    try {
      this.#bouquets = await this.#apiService.get();
      console.log(this.#bouquets)
    } catch {
      this.#bouquets = [];
    }
    this._notify(UpdateType.INIT);
  }

  get = () => this.#bouquets;

  getById = (id) => this.#apiService.getById(id);
}
