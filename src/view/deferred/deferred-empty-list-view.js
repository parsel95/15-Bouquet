import AbstractView from '../../framework/view/abstract-view.js';

const createDeferredEmptyListTemplate = () =>
  `
    <div class="message catalogue__no-items" style="margin: 50px auto 50px; max-width: 1500px">
      <p class="text text--align-center message__text">Извините, но вы не выбрали ни одного букета</p>
    </div>
  `;

export default class DeferredEmptyListView extends AbstractView {
  get template() {
    return createDeferredEmptyListTemplate();
  }
}
