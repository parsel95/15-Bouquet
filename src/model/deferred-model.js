import Observable from '../framework/observable.js';
import {UpdateType, ErrorType} from '../const.js';

const createEmptyDeferred = () => ({
  products: {},
  productCount: 0,
  sum: 0,
});

export default class DeferredModel extends Observable {
  #deferred = createEmptyDeferred();
  #apiService = null;
  #isLoaded = false;
  #isLoadError = false;

  constructor(apiService) {
    super();
    this.#apiService = apiService;
  }

  init = async () => {
    this.#isLoadError = false;

    try {
      this.#deferred = this.#normalizeDeferred(
        await this.#apiService.get()
      );
    } catch {
      this.#deferred = createEmptyDeferred();
      this.#isLoadError = true;
      this._notify(UpdateType.ERROR_LOAD_DEFERRED);
    }

    this.#isLoaded = true;
    this._notify(UpdateType.INIT);
    this._notify(UpdateType.MINOR);
  }

  getActualDeferred = async () => {
    return this.#normalizeDeferred(
      await this.#apiService.get()
    );
  }

  get = () => this.#deferred;

  getIsLoaded = () => this.#isLoaded;

  getIsLoadError = () => this.#isLoadError;

  has = (bouquetId) => {
    return Object.hasOwn(this.#deferred.products, bouquetId);
  }

  #normalizeDeferred(deferred) {
    return Object.keys(deferred).length === 0
      ? createEmptyDeferred()
      : deferred;
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

      const error = new Error('Can\'t add bouquet');
      error.type = ErrorType.ADD_DEFERRED;
      throw error;
    }
  }

  delete = async (updateType, bouquet) => {
    this.#decrement(updateType, bouquet);

    try {
      await this.#apiService.delete(bouquet.id);
    } catch {
      this.#decrement(updateType, bouquet, 'add');

      const error = new Error('Can\'t delete bouquet');
      error.type = ErrorType.DELETE_DEFERRED;
      throw error;
    }
  }

  cleanAll = async (updateType) => {
    const bouquetIds = Object.keys(this.#deferred.products);

    const results = await Promise.allSettled(
      bouquetIds.map(async (bouquetId) => {
        const quantity = this.#deferred.products[bouquetId];

        for (let i = 0; i < quantity; i++) {
          await this.#apiService.delete(bouquetId);
        }
      })
    );

    const hasError = results.some(
      (result) => result.status === 'rejected'
    );

    if (!hasError) {
      this.#deferred = createEmptyDeferred();
      this._notify(updateType);
      return;
    }

    try {
      const actualDeferred = await this.getActualDeferred();

      this.#deferred = actualDeferred;
      this._notify(updateType);
    } catch {
      const error = new Error('Can\'t synchronize deferred');
      error.type = ErrorType.SYNC_DEFERRED;
      throw error;
    }

    const error = new Error('Can\'t delete all bouquets');
    error.type = ErrorType.CLEAN_ALL_DEFERRED;
    throw error;
  }

  deleteCard = async (updateType, bouquet) => {
    const savedCount = this.#deferred.products[bouquet.id];
    const savedPrice = bouquet.price * this.#deferred.products[bouquet.id];
    const deleteRequests = [];

    this.#deferred.productCount -= savedCount;
    this.#deferred.sum -= savedPrice;

    delete this.#deferred.products[bouquet.id];

    this._notify(updateType);

    for (let i = 0; i < savedCount; i++) {
      deleteRequests.push(
        this.#apiService.delete(bouquet.id)
      );
    }

    const results = await Promise.allSettled(deleteRequests);
    const hasError = results.some(
      (result) => result.status === 'rejected'
    );

    if (!hasError) {
      return;
    }

    try {
      const actualDeferred = await this.getActualDeferred();

      this.#deferred = actualDeferred;
      this._notify(updateType);
    } catch {
      const error = new Error('Can\'t synchronize deferred');
      error.type = ErrorType.SYNC_DEFERRED;
      throw error;
    }

    const error = new Error('Can\'t delete this card');
    error.type = ErrorType.CLEAN_CARD_DEFERRED;
    throw error;
  }

  toggleDeferred = (updateType, bouquet) => {
    if (this.has(bouquet.id)) {
      return this.delete(updateType, bouquet);
    }

    return this.add(updateType, bouquet);
  }
}
