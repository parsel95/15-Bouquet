// Импорт вендоров и утилит, не удаляйте его
import PagePresenter from'./presenter/page-presenter.js';
import DeferredPresenter from './presenter/deferred-presenter.js';
import BouquetsModel from './model/bouquets-model.js';
import DeferredModel from './model/deferred-model.js';
import FilterModel from './model/filter-model.js';

import './vendor.js';
import {ImageSlider } from './utils/image-slider.js';
import {iosVhFix} from './utils/ios-vh-fix.js';
import {modals, initModals} from './modals/init-modals.js';
import {bouquets} from './mock/bouquets.js';

import {render, RenderPosition} from './framework/render.js';

const bodyElement = document.querySelector('body');
const headerContainerElement = bodyElement.querySelector('.header__container');
const mainElement = bodyElement.querySelector('main');

const bouquetsModel = new BouquetsModel();
const deferredModel = new DeferredModel();
const filterModel = new FilterModel();

const pagePresenter = new PagePresenter(mainElement, bodyElement, headerContainerElement, deferredModel, bouquetsModel, filterModel);
const deferredPresenter = new DeferredPresenter(bodyElement, bouquetsModel, deferredModel);

pagePresenter.init();
// deferredPresenter.init();

// Код для работы попапов, не удаляйте его
window.addEventListener("DOMContentLoaded", () => {
  iosVhFix();

  window.addEventListener("load", () => {
    // Инициализация слайдера
    const imageSlider = new ImageSlider(".image-slider");
    imageSlider.init();

    // Инициализация попапов
    initModals();
  });

  // Пример кода для открытия попапа
  document
    .querySelector(".element-which-is-open-popup")
    .addEventListener("click", () => modals.open("popup-data-attr"));

  // Код отработает, если разметка попапа уже отрисована в index.html

  // Если вы хотите рисовать разметку попапа под каждое "открытие",
  // то не забудьте перенесети в код addEventListener инициализацию слайдера

  // ------------

  // Ваш код...
});
