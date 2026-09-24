// Импорт вендоров и утилит, не удаляйте его
import AppPresenter from './presenter/app-presenter.js';
import BouquetsModel from './model/bouquets-model.js';
import DeferredModel from './model/deferred-model.js';
import FilterModel from './model/filter-model.js';

import ImageSlider from './utils/image-slider.js';
import {render, RenderPosition} from './framework/render.js';

import BouquetsApiService from './api-services/bouquets-api-service.js';
import DeferredApiService from './api-services/deferred-api-service.js';

const AUTHORIZATION = 'Basic s2191inzd2tz';
const END_POINT = 'https://grading.objects.htmlacademy.pro';

const bodyElement = document.querySelector('body');
const wrapperElement = bodyElement.querySelector('.wrapper');
const mainElement = bodyElement.querySelector('main');

const bouquetsModel = new BouquetsModel(new BouquetsApiService(END_POINT, AUTHORIZATION));
const deferredModel = new DeferredModel(new DeferredApiService(END_POINT, AUTHORIZATION));
const filterModel = new FilterModel();

const appPresenter = new AppPresenter(
  bodyElement,
  wrapperElement,
  mainElement,
  bouquetsModel,
  deferredModel,
  filterModel
);

bouquetsModel.init();
deferredModel.init();
appPresenter.init();
