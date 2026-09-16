import AbstractView from '../../framework/view/abstract-view.js';

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
    type === "noItems" ?
      this.element.querySelector('p').textContent = `К сожалению, таких букетов у нас пока нет` :
      this.element.querySelector('p').textContent = `К сожалению, мы не смогли загрузить букеты. Обновите страницу или попробуйте позже.`;
  }
}
