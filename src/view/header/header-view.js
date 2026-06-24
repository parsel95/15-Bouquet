import AbstractView from '../../framework/view/abstract-view.js';

const createHeaderTemplate = () =>
  `
    <header class="header">
      <div class="container">
        <div class="header__wrapper">
          <div class="logo"></div>
          <div class="header__title">
            <h1 class="title title--header">Букетик</h1>
          </div>
          <div class="header__container"></div>
        </div>
      </div>
    </header>
  `;


export default class HeaderView extends AbstractView {
  get template() {
    return createHeaderTemplate();
  }

  get logoContainer() {
    return this.element.querySelector('.logo');
  }

  get headerContainer() {
    return this.element.querySelector('.header__container');
  }
}
