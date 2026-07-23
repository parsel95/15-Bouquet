import AbstractView from '../framework/view/abstract-view.js';
import {SortType} from '../const.js';


const createSortingTemplate = (activeSortType) =>
  `
    <div class="sorting-price">
      <h3 class="title sorting-price__title">Цена</h3>
        <a
          class="
            sorting-price__link
            sorting-price__link--incr
            ${(activeSortType === SortType.PRICE_UP) ? 'sorting-price__link--active' : ''}
          "
          href="#"
          aria-label="сортировка по возрастанию цены"
          data-sort-type="${SortType.PRICE_UP}"
        >
          <svg class="sorting-price__icon" width="50" height="46" aria-hidden="true">
            <use xlink:href="#icon-increase-sort"></use>
          </svg>
        </a>
        <a
          class="
            sorting-price__link
            ${(activeSortType === SortType.PRICE_DOWN) ? 'sorting-price__link--active' : ''}
          "
          href="#"
          aria-label="сортировка по убыванию цены"
          data-sort-type="${SortType.PRICE_DOWN}"
        >
          <svg class="sorting-price__icon" width="50" height="46" aria-hidden="true">
            <use xlink:href="#icon-descending-sort"></use>
          </svg>
        </a>
    </div>
  `;

export default class SortingView extends AbstractView {
  #currentSortType = null;

  constructor(currentSortType) {
    super();
    this.#currentSortType = currentSortType;
  }

  get template() {
    return createSortingTemplate(this.#currentSortType);
  }

  setSortTypeChangeHandler = (callback) => {
    this._callback.sortTypeChange = callback;
    this.element.addEventListener('click', this.#sortTypeChangeHandler);
  }

  #sortTypeChangeHandler = (evt) => {
    const targetLink = evt.target.closest('a');

    if (!targetLink) {
      return;
    }

    evt.preventDefault();
    this._callback.sortTypeChange(targetLink.dataset.sortType);
  }
}


