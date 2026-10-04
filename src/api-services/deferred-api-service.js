import ApiService from '../framework/api-service.js';
import {Method} from '../const.js';

export default class DeferredApiService extends ApiService {
  get = () => this._load({url: 'flowers-shop/cart'})
    .then(ApiService.parseResponse);

  add = async (bouquet) => {
    await this._load({
      url: `flowers-shop/products/${bouquet.id}`,
      method: Method.PUT,
      headers: new Headers({'Content-Type': 'application/json'})
    });
  };

  delete = async (bouquetId) => {
    await this._load({
      url: `flowers-shop/products/${bouquetId}`,
      method: Method.DELETE,
      headers: new Headers({'Content-Type': 'application/json'})
    });
  };
}
