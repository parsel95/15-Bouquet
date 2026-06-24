import AbstractView from '../framework/view/abstract-view.js';

const createFooterTemplate = () =>
  `
    <footer class="footer">
      <div class="container">
        <div class="footer__wrapper">
          <div class="footer__logo-content">
            <div class="logo"></div>
            <div class="footer__text">
              <h2>Букетик</h2>
              <p>Магазин авторских букетов</p>
            </div>
          </div>
          <div class="footer__social">
            <ul class="social-list">
              <li class="social-list__item">
                <a
                  class="social-list__link"
                  href="#"
                  aria-label="Вконтакте"
                  target="_blank"
                  rel="nofollow noopener"
                >
                  <svg width="50" height="50" aria-hidden="true">
                    <use xlink:href="#icon-vk"></use>
                  </svg>
                </a>
              </li>
              <li class="social-list__item">
                <a
                  class="social-list__link"
                  href="#"
                  aria-label="Телеграмм"
                  target="_blank"
                  rel="nofollow noopener"
                >
                  <svg width="50" height="50" aria-hidden="true">
                    <use xlink:href="#icon-telegram"></use>
                  </svg>
                </a>
              </li>
            </ul>
          </div>
          <div class="footer__develope">
            <p class="text text--size-20-30">Разработано в .html academy</p>
          </div>
        </div>
      </div>
    </footer>
  `;

export default class FooterView extends AbstractView {
  get template() {
    return createFooterTemplate();
  }

  get logoContainer() {
    return this.element.querySelector('.logo');
  }
}
