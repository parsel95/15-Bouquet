import ApiService from '../framework/api-service.js';

/**
 * Выполняет запросы к API каталога букетов.
 * Оба метода возвращают разобранные JSON-ответы сервера.
 */
export default class BouquetsApiService extends ApiService {
  get = () => this._load({url: 'flowers-shop/products'})
    .then(ApiService.parseResponse);

  /** @param {number|string} id Идентификатор букета. */
  getById = (id) => this._load({url: `flowers-shop/products/${id}`})
    .then(ApiService.parseResponse);
}
