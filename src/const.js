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
  PRICE_DOWN: 'price-down'
}

const UserAction = {
  UPDATE_BOUQUET: 'UPDATE_BOUQUET',
  ADD_BOUQUET: 'ADD_BOUQUET',
  DELETE_BOUQUET: 'DELETE_BOUQUET',
  INCREMENT_BOUQUET: 'INCREMENT_BOUQUET',
  DECREMENT_BOUQUET: 'DECREMENT_BOUQUET',
  CLEAN_ALL_BOUQUETS: 'CLEAN_ALL_BOUQUETS'
}

const UpdateType = {
  PATCH: 'PATCH',
  MINOR: 'MINOR',
  MAJOR: 'MAJOR',
  INIT: 'INIT',
  ERROR: 'ERROR'
}

const Method = {
  GET: 'GET',
  PUT: 'PUT',
  DELETE: 'DELETE',
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
  Method
};
