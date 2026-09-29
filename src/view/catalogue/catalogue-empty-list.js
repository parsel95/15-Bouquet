import AbstractView from '../../framework/view/abstract-view.js';
import {CatalogueMessageType, ErrorMessage} from '../../const.js';

const createCatalogueEmptyListTemplate = () =>
  `
    <div class="message catalogue__no-items">
      <p class="text text--align-center message__text">
          К сожалению, таких букетов у нас пока нет.
      </p>
    </div>
  `;

export default class CatalogueEmptyListView extends AbstractView {
  get template() {
    return createCatalogueEmptyListTemplate();
  }

  setText = (type) => {
    let text = null;

    switch (type){
      case CatalogueMessageType.EMPTY:
        text = ErrorMessage[CatalogueMessageType.EMPTY]
        break;
      case CatalogueMessageType.ERROR_BOUQUETS:
        text = ErrorMessage[CatalogueMessageType.ERROR_BOUQUETS]
        break;
    }

    this.element.querySelector('p').textContent = text;
  }
}
