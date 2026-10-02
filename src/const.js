const ReasonType = {
  ALL: 'all',
  BIRTHDAY: 'birthday',
  BRIDE: 'bride',
  MOTHER: 'mother',
  COLLEAGUE: 'colleague',
  DARLING: 'darling',
}

const ReasonTypeText = {
  [ReasonType.ALL]: 'Для всех',
  [ReasonType.BIRTHDAY]: 'Имениннику',
  [ReasonType.BRIDE]: 'Невесте',
  [ReasonType.MOTHER]: 'Маме',
  [ReasonType.COLLEAGUE]: 'Коллеге',
  [ReasonType.DARLING]: 'Любимой',
}

const ColorType = {
  ALL: 'all',
  RED: 'red',
  WHITE: 'white',
  LILAC: 'lilac',
  YELLOW: 'yellow',
  PINK: 'pink',
}

const ColorTypeText = {
  [ColorType.ALL]: 'все цвета',
  [ColorType.RED]: 'красный',
  [ColorType.WHITE]: 'белый',
  [ColorType.LILAC]: 'сиреневый',
  [ColorType.YELLOW]: 'жёлтый',
  [ColorType.PINK]: 'розовый',
}

const LabelType = {
  birthday: "имениннику",
  darling: "любимой",
  bride: "невесте",
  colleague: "коллеге",
  mother: "маме",
};

const LogoConfig = {
  HEADER: { width: 86, height: 84 },
  FOOTER: { width: 60, height: 59 }
};

const logoParentName = 'FOOTER';

const Page = {
  MAIN: 'MAIN',
  DEFERRED: 'DEFERRED'
}

const SortType = {
  PRICE_UP: 'price-up',
  PRICE_DOWN: 'price-down',
}

const UserAction = {
  UPDATE_BOUQUET: 'UPDATE_BOUQUET',
  ADD_BOUQUET: 'ADD_BOUQUET',
  DELETE_BOUQUET: 'DELETE_BOUQUET',
  INCREMENT_BOUQUET: 'INCREMENT_BOUQUET',
  DECREMENT_BOUQUET: 'DECREMENT_BOUQUET',
  CLEAN_ALL_BOUQUETS: 'CLEAN_ALL_BOUQUETS',
}

const UpdateType = {
  PATCH: 'PATCH',
  MINOR: 'MINOR',
  MAJOR: 'MAJOR',
  INIT: 'INIT',
  LOADING: 'LOADING',
  ERROR_LOAD_DEFERRED: 'ERROR_LOAD_DEFERRED',
}

const Method = {
  GET: 'GET',
  PUT: 'PUT',
  DELETE: 'DELETE',
};

const CatalogueMessageType = {
  EMPTY: 'EMPTY',
}

const CatalogueMessage = {
  [CatalogueMessageType.EMPTY]: 'К сожалению, таких букетов у нас пока нет',
}

const ErrorType = {
  LOAD_BOUQUETS: 'LOAD_BOUQUETS',
  LOAD_DEFERRED: 'LOAD_DEFERRED',
  ADD_DEFERRED: 'ADD_DEFERRED',
  DELETE_DEFERRED: 'DELETE_DEFERRED',
  CLEAN_CARD_DEFERRED: 'CLEAN_CARD_DEFERRED',
  CLEAN_ALL_DEFERRED: 'CLEAN_ALL_DEFERRED',
  LOAD_MODAL: 'LOAD_MODAL',
  SYNC_DEFERRED: 'SYNC_DEFERRED',
}

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
};
