import AbstractView from '../../framework/view/abstract-view.js';

const createDeferredTemplate = () =>
  `
    <div class="popup-deferred__wrapper"></div>
  `;

export default class DeferredView extends AbstractView {
  get template() {
    return createDeferredTemplate();
  }
}
