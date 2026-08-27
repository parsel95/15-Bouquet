import ApiService from '../framework/api-service.js';
import {Method} from '../const.js';

export default class BouquetsApiService extends ApiService {
  get = () => this._load({url: 'flowers-shop/products'})
    .then(ApiService.parseResponse);

  getById = (id) => this._load({url: `flowers-shop/products/${id}`})
    .then(ApiService.parseResponse);
}
