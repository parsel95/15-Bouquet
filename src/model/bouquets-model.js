import Observable from '../framework/observable';
import {UpdateType} from '../const.js';

export default class BouquetsModel extends Observable {
  #bouquets = [];
  #apiService = null;
  #isLoaded = false;
  #isLoadingError = false;

  constructor(apiService) {
    super();
    this.#apiService = apiService;
  }

  init = async () => {
    let updateType = UpdateType.INIT;

    try {
      const bouquets = await this.#apiService.get();

      this.#bouquets = bouquets.map(this.#adaptToClient);
      this.#isLoadingError = false;
    } catch {
      this.#bouquets = [];
      this.#isLoadingError = true;
      
      updateType = UpdateType.ERROR;
    }

    this.#isLoaded = true;

    this._notify(updateType);
  }

  get = () => this.#bouquets;

  getIsLoaded = () => this.#isLoaded;

  getIsLoadingError = () => this.#isLoadingError;

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
      return "liac";
    } else {
      return color;
    }
  }
}
