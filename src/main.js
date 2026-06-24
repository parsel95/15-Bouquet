// Импорт вендоров и утилит, не удаляйте его
import AppPresenter from './presenter/app-presenter.js';
import BouquetsModel from './model/bouquets-model.js';
import DeferredModel from './model/deferred-model.js';
import FilterModel from './model/filter-model.js';

import ImageSlider from './utils/image-slider.js';

import {render, RenderPosition} from './framework/render.js';

const bodyElement = document.querySelector('body');
const wrapperElement = bodyElement.querySelector('.wrapper');
const mainElement = bodyElement.querySelector('main');

const bouquetsModel = new BouquetsModel();
const deferredModel = new DeferredModel();
const filterModel = new FilterModel();

const appPresenter = new AppPresenter(
  bodyElement,
  wrapperElement,
  mainElement,
  bouquetsModel,
  deferredModel,
  filterModel
);

appPresenter.init();

// Код для работы попапов, не удаляйте его
// window.addEventListener("DOMContentLoaded", () => {
//   window.addEventListener("load", () => {
//     // Инициализация слайдера
//     const imageSlider = new ImageSlider(".image-slider");
//     imageSlider.init();

//     // Инициализация попапов
//     // initModals();
//   });

  // Пример кода для открытия попапа
  // document
  //   .querySelector(".element-which-is-open-popup")
  //   .addEventListener("click", () => modals.open("popup-data-attr"));

  // Код отработает, если разметка попапа уже отрисована в index.html

  // Если вы хотите рисовать разметку попапа под каждое "открытие",
  // то не забудьте перенесети в код addEventListener инициализацию слайдера

  // ------------

  // Ваш код...
// });
