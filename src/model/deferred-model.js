import Observable from '../framework/observable.js';
import {deferredBoquets} from '../mock/deferred-bouquets.js';
import {UpdateType} from '../const.js';

const deferred = {
  products: {},
  productCount: 0,
  sum: 0,
};

export default class DeferredModel extends Observable {
  #deferredBouquets = deferredBoquets;
  #deferred = deferred;
  #apiService = null;
  #isLoaded = false;

  constructor(apiService) {
    super();
    this.#apiService = apiService;
  }

  init = async () => {
    try {
      this.#deferred = await this.#apiService.get();
      if (Object.keys(this.#deferred).length === 0) {
        this.#deferred = deferred;
      }
    } catch {
      console.log('DEFERRED ERROR:');
      this.#deferred = deferred;
    }

    this.#isLoaded = true;

    this._notify(UpdateType.INIT);
  }

  get = () => this.#deferred;

  getIsLoaded = () => this.#isLoaded;

  has = (bouquetId) => {
    return Object.hasOwn(this.#deferred.products, bouquetId);
  }

  #increment(updateType, bouquet, action = 'add') {
    if (action === 'add') {
      if (this.#deferred.products[bouquet.id]) {
        this.#deferred.products[bouquet.id]++;
      } else {
        this.#deferred.products[bouquet.id] = 1;
      }

      this.#deferred.productCount++;
      this.#deferred.sum += bouquet.price;
    } else {
      this.#deferred.products[bouquet.id]--;

      if (this.#deferred.products[bouquet.id] === 0) {
        delete this.#deferred.products[bouquet.id];
      }

      this.#deferred.productCount--;
      this.#deferred.sum -= bouquet.price;
    }

    this._notify(updateType, bouquet);
  }

  #decrement(updateType, bouquet, action = 'delete') {
    if (action === 'delete') {
      if (this.#deferred.products[bouquet.id] > 1) {
        this.#deferred.products[bouquet.id]--;
      } else {
        delete this.#deferred.products[bouquet.id];
      }

      this.#deferred.productCount--;
      this.#deferred.sum -= bouquet.price;
    } else {
      if (!this.#deferred.products[bouquet.id]) {
        this.#deferred.products[bouquet.id] = 1;
      } else {
        this.#deferred.products[bouquet.id]++;
      }

      this.#deferred.productCount++;
      this.#deferred.sum += bouquet.price;
    }

    this._notify(updateType, bouquet);
  }

  add = async (updateType, bouquet) => {
    this.#increment(updateType, bouquet);

    try {
      await this.#apiService.add(bouquet);
    } catch {
      this.#increment(updateType, bouquet, 'delete');

      throw new Error('Can\'t add bouquet');
    }
  }

  delete = async (updateType, bouquet) => {
    this.#decrement(updateType, bouquet);

    try {
      await this.#apiService.delete(bouquet.id);
    } catch {
      this.#decrement(updateType, bouquet, 'add');

      throw new Error('Can\'t delete bouquet');
    }
  }

  cleanAll = async (updateType) => {
    const savedDeferred = this.#deferred;
    console.log(this.#deferred)
    this.#deferred = deferred;
    this._notify(updateType);

    try {
      const bouquetIds = Object.keys(savedDeferred.products);

      await Promise.all(
        bouquetIds.map(async (bouquetId) => {
          const quantity = savedDeferred.products[bouquetId];

          for (let i = 0; i < quantity; i++) {
            await this.#apiService.delete(bouquetId);
          }
        })
      );
    } catch {
      this.#deferred = savedDeferred;
      this._notify(updateType);

      throw new Error('Can\'t delete all bouquets');
    }
  }

  deleteCard = async (updateType, bouquet) => {
    const savedCount = this.#deferred.products[bouquet.id];
    const savedPrice = bouquet.price * this.#deferred.products[bouquet.id]

    this.#deferred.productCount -= savedCount;
    this.#deferred.sum -= savedPrice;

    delete this.#deferred.products[bouquet.id];

    this._notify(updateType);

    try {
      const deleteRequests = [];

      for (let i = 0; i < savedCount; i++) {
        deleteRequests.push(
          this.#apiService.delete(bouquet.id)
        );
      }

      await Promise.all(deleteRequests);
    } catch {
      this.#deferred.productCount += savedCount;
      this.#deferred.sum += savedPrice;
      this.#deferred.products[bouquet.id] = savedCount;

      this._notify(updateType);

      throw new Error('Can\'t delete this card');
    }
  }

  toggleDeferred = (updateType, bouquet) => {
    if (this.has(bouquet.id)) {
      return this.delete(updateType, bouquet);
    }

    return this.add(updateType, bouquet);
  }
}
