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
    this._notify(UpdateType.INIT);
  }

  get = () => this.#deferred;

  has = (bouquetId) => {
    return Object.hasOwn(this.#deferred.products, bouquetId);
  }

  decrement = (updateType, bouquet) => {
    if (this.#deferredBouquets.products[bouquet.id] > 1) {
      this.#deferredBouquets.products[bouquet.id]--;
    } else {
      delete this.#deferredBouquets.products[bouquet.id];
    }

    this._notify(updateType, bouquet);
  }

  cleanAll = async (updateType) => {
    const bouquetIds = Object.keys(this.#deferred.products);

    await Promise.all(
      bouquetIds.map(async (bouquetId) => {
        const quantity = this.#deferred.products[bouquetId];

        for (let i = 0; i < quantity; i++) {
          await this.#apiService.delete(bouquetId);
        }
      })
    );

    this.#deferred = await this.#apiService.get();

    this._notify(updateType);
  }

  deleteCard = async (updateType, bouquet) => {
    const deleteRequests = [];

    for (let i = 0; i < this.#deferred.products[bouquet.id]; i++) {
      deleteRequests.push(
        this.#apiService.delete(bouquet.id)
      );
    }

    await Promise.all(deleteRequests);

    this.#deferred = await this.#apiService.get();

    this._notify(updateType);
  }

  add = async (updateType, bouquet) => {
     console.time('ADD');
    const addedBouquet = await this.#apiService.add(bouquet);
console.timeLog('ADD', 'сервер ответил');
  if (this.#deferred.products[addedBouquet.id]) {
    this.#deferred.products[addedBouquet.id]++;
  } else {
    this.#deferred.products[addedBouquet.id] = 1;
  }

  this.#deferred.productCount++;
  this.#deferred.sum += addedBouquet.price;
    // try {
    //   await this.#apiService.add(bouquet);
    //   // this.#deferred = await this.#apiService.get();
    // } catch {
    //   throw new Error('Can\'t delete bouquet');
    // }

    this._notify(updateType, bouquet);
    console.timeLog('ADD', 'notify закончен');
  console.timeEnd('ADD');
  }

  delete = async (updateType, bouquet) => {
    await this.#apiService.delete(bouquet.id);
    this.#deferred = await this.#apiService.get();
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
