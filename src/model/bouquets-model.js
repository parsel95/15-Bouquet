import Observable from '../framework/observable';
import {UpdateType} from '../const.js';

export default class BouquetsModel extends Observable {
  #bouquets = [];
  #apiService = null;
  #isLoaded = false;
  #isLoadError = false;

  constructor(apiService) {
    super();
    this.#apiService = apiService;
  }

  init = async () => {
    this.#isLoaded = false;
    this.#isLoadError = false;

    this._notify(UpdateType.LOADING);

    try {
      const bouquets = await this.#apiService.get();

      this.#bouquets = bouquets.map(this.#adaptToClient);
      this.#isLoadError = false;
    } catch {
      this.#bouquets = [];
      this.#isLoadError = true;
    }

    this.#isLoaded = true;
    this._notify(UpdateType.INIT);
  }

  get = () => this.#bouquets;

  getIsLoaded = () => this.#isLoaded;

  getIsLoadError = () => this.#isLoadError;

  getById = (id) => this.#apiService.getById(id);

  #adaptToClient = (bouquet) => {
    return {
      ...bouquet,
      type: this.#adaptType(bouquet.type),
      color: this.#adaptColor(bouquet.color),
    }
  }

  #adaptType = (type) => {
    switch (type) {
      case "birthdayboy":
        return "birthday";
      case "forlove":
        return "darling";
      case "bridge":
        return "bride";
      case "colleagues":
        return "colleague";
      case "motherday":
        return "mother";
      default:
        return type;
    }
  }

  #adaptColor = (color) => {
    if (color === "violet") {
      return "lilac";
    } else {
      return color;
    }
  }
}
