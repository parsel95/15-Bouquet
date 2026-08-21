import {ReasonType, ColorType} from '../const.js';

const filterReason = {
  [ReasonType.ALL]: (bouquets) => [...bouquets],
  [ReasonType.BIRTHDAY]: (bouquets) => bouquets.filter((bouquet) => bouquet.type === ReasonType.BIRTHDAY ),
  [ReasonType.BRIDE]: (bouquets) => bouquets.filter((bouquet) => bouquet.type === ReasonType.BRIDE),
  [ReasonType.MOTHER]: (bouquets) => bouquets.filter((bouquet) => bouquet.type === ReasonType.MOTHER),
  [ReasonType.COLLEAGUE]: (bouquets) => bouquets.filter((bouquet) => bouquet.type === ReasonType.COLLEAGUE),
  [ReasonType.DARLING]: (bouquets) => bouquets.filter((bouquet) => bouquet.type === ReasonType.DARLING),
}

const filterColor = {
  [ColorType.ALL]: (bouquets) => [...bouquets],
  [ColorType.RED]: (bouquets) => bouquets.filter((bouquet) => bouquet.color === ColorType.RED ),
  [ColorType.WHITE]: (bouquets) => bouquets.filter((bouquet) => bouquet.color === ColorType.WHITE),
  [ColorType.LILAC]: (bouquets) => bouquets.filter((bouquet) => bouquet.color === ColorType.LILAC),
  [ColorType.YELLOW]: (bouquets) => bouquets.filter((bouquet) => bouquet.color === ColorType.YELLOW),
  [ColorType.PINK]: (bouquets) => bouquets.filter((bouquet) => bouquet.color === ColorType.PINK),
}

export {filterReason, filterColor};
