import AbstractView from '../../framework/view/abstract-view.js';

const createCatalogueEmptyListTemplate = () =>
  `
    <div class="message catalogue__no-items">
      <p class="text text--align-center message__text">
          К сожалению, таких букетов у нас пока нет.
      </p>
    </div>
  `;

/**
 * Показывает сообщение вместо списка каталога.
 * Presenter задаёт текст, чтобы использовать View для пустого результата
 * или сообщения об ошибке загрузки.
 */
export default class CatalogueEmptyListView extends AbstractView {
  get template() {
    return createCatalogueEmptyListTemplate();
  }

  setText = (text) => {
    this.element.querySelector('p').textContent = text;
  };
}
