import AbstractView from '../../framework/view/abstract-view.js';

const createDeferredBtnContainerTemplate = () =>
  `
    <div class="popup-deferred__btn-container"></div>
  `;

export default class DeferredBtnContainerView extends AbstractView {
  get template() {
    return createDeferredBtnContainerTemplate();
  }
}
