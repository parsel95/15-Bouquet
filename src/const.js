const ReasonType = {
  ALL: 'all',
  BIRTHDAY: 'birthday',
  BRIDE: 'bride',
  MOTHER: 'mother',
  COLLEAGUE: 'colleague',
  DARLING: 'darling'
}

const ReasonTypeText = {
  [ReasonType.ALL]: 'Для всех',
  [ReasonType.BIRTHDAY]: 'Имениннику',
  [ReasonType.BRIDE]: 'Невесте',
  [ReasonType.MOTHER]: 'Маме',
  [ReasonType.COLLEAGUE]: 'Коллеге',
  [ReasonType.DARLING]: 'Любимой'
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
  [ColorType.PINK]: 'розовый'
}

const LabelType = {
  birthdayboy: "имениннику",
  forlove: "любимой",
  bridge: "невесте",
  colleagues: "коллеге",
  motherday: "маме",
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

export {
  ReasonType,
  ReasonTypeText,
  ColorType,
  ColorTypeText,
  LabelType,
  LogoConfig,
  logoParentName,
  Page
};
