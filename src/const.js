// Типы причин
const ReasonType = {
  ALL: 'all',
  BIRTHDAY: 'birthday',
  BRIDE: 'bride',
  MOTHER: 'mother',
  COLLEAGUE: 'colleague',
  DARLING: 'darling',
};

// Текст для отображения причин
const ReasonTypeText = {
  [ReasonType.ALL]: 'Для всех',
  [ReasonType.BIRTHDAY]: 'Имениннику',
  [ReasonType.BRIDE]: 'Невесте',
  [ReasonType.MOTHER]: 'Маме',
  [ReasonType.COLLEAGUE]: 'Коллеге',
  [ReasonType.DARLING]: 'Любимой',
};

// Типы цветов
const ColorType = {
  ALL: 'all',
  RED: 'red',
  WHITE: 'white',
  LILAC: 'lilac',
  YELLOW: 'yellow',
  PINK: 'pink',
};

// Текст для отображения цветов
const ColorTypeText = {
  [ColorType.ALL]: 'все цвета',
  [ColorType.RED]: 'красный',
  [ColorType.WHITE]: 'белый',
  [ColorType.LILAC]: 'сиреневый',
  [ColorType.YELLOW]: 'жёлтый',
  [ColorType.PINK]: 'розовый',
};

// Типы надписей на букете
const LabelType = {
  birthday: 'имениннику',
  darling: 'любимой',
  bride: 'невесте',
  colleague: 'коллеге',
  mother: 'маме',
};

// Конфигурация логотипа
const LogoConfig = {
  HEADER: {width: 86, height: 84},
  FOOTER: {width: 60, height: 59}
};

// Имя родительского элемента для логотипа в футере
const logoParentName = 'FOOTER';

// Типы страниц
const Page = {
  MAIN: 'MAIN',
  DEFERRED: 'DEFERRED'
};

// Типы сортировки
const SortType = {
  PRICE_UP: 'price-up',
  PRICE_DOWN: 'price-down',
};

// Типы действий пользователя
const UserAction = {
  TOGGLE_DEFERRED: 'TOGGLE_DEFERRED',
  INCREMENT_DEFERRED: 'INCREMENT_DEFERRED',
  DECREMENT_DEFERRED: 'DECREMENT_DEFERRED',
  REMOVE_DEFERRED_ITEM: 'REMOVE_DEFERRED_ITEM',
  CLEAR_DEFERRED: 'CLEAR_DEFERRED',
};

// Типы обновлений данных
const UpdateType = {
  PATCH: 'PATCH',
  MINOR: 'MINOR',
  MAJOR: 'MAJOR',
  INIT: 'INIT',
  LOADING: 'LOADING',
  ERROR_LOAD_DEFERRED: 'ERROR_LOAD_DEFERRED',
};

// Типы HTTP-методов
const Method = {
  GET: 'GET',
  PUT: 'PUT',
  DELETE: 'DELETE',
};

// Типы сообщений для каталога
const CatalogueMessageType = {
  EMPTY: 'EMPTY',
};

// Сообщения для отображения в каталоге
const CatalogueMessage = {
  [CatalogueMessageType.EMPTY]: 'К сожалению, таких букетов у нас пока нет',
};

// Типы ошибок
const ErrorType = {
  LOAD_BOUQUETS: 'LOAD_BOUQUETS',
  LOAD_DEFERRED: 'LOAD_DEFERRED',
  ADD_DEFERRED: 'ADD_DEFERRED',
  DELETE_DEFERRED: 'DELETE_DEFERRED',
  CLEAN_CARD_DEFERRED: 'CLEAN_CARD_DEFERRED',
  CLEAN_ALL_DEFERRED: 'CLEAN_ALL_DEFERRED',
  LOAD_MODAL: 'LOAD_MODAL',
  SYNC_DEFERRED: 'SYNC_DEFERRED',
};

// Сообщения об ошибках для отображения пользователю
const ErrorMessage = {
  [ErrorType.LOAD_BOUQUETS]:
    'К сожалению, нам не удалось загрузить букеты. Попробуйте ещё раз',

  [ErrorType.LOAD_DEFERRED]:
    'Не удалось загрузить отложенные. Попробуйте ещё раз.',

  [ErrorType.ADD_DEFERRED]:
    'Не удалось добавить букет в отложенные. Попробуйте ещё раз.',

  [ErrorType.DELETE_DEFERRED]:
    'Не удалось удалить букет из отложенных. Попробуйте ещё раз.',

  [ErrorType.CLEAN_CARD_DEFERRED]:
    'Не удалось удалить все экземпляры этого букета. Попробуйте ещё раз.',

  [ErrorType.CLEAN_ALL_DEFERRED]:
    'Не удалось очистить отложенные. Попробуйте ещё раз.',

  [ErrorType.LOAD_MODAL]:
    'Не удалось загрузить информацию о букете. Попробуйте ещё раз.',

  [ErrorType.SYNC_DEFERRED]:
    'Не удалось синхронизировать отложенные. Попробуйте ещё раз.',
};

const ErrorThrowMessage = {
  [ErrorType.LOAD_BOUQUETS]:
    'Can\'t load bouquets',

  [ErrorType.LOAD_DEFERRED]:
    'Can\'t load deferred',

  [ErrorType.ADD_DEFERRED]:
    'Can\'t add bouquet to deferred',

  [ErrorType.DELETE_DEFERRED]:
    'Can\'t delete bouquet from deferred',

  [ErrorType.CLEAN_CARD_DEFERRED]:
    'Can\'t delete all instances of this bouquet',

  [ErrorType.CLEAN_ALL_DEFERRED]:
    'Can\'t clean all deferred',

  [ErrorType.LOAD_MODAL]:
    'Can\'t load modal data',

  [ErrorType.SYNC_DEFERRED]:
    'Can\'t synchronize deferred',
};

export {
  ReasonType,
  ReasonTypeText,
  ColorType,
  ColorTypeText,
  LabelType,
  LogoConfig,
  logoParentName,
  Page,
  SortType,
  UserAction,
  UpdateType,
  Method,
  CatalogueMessageType,
  CatalogueMessage,
  ErrorType,
  ErrorMessage,
  ErrorThrowMessage
};
