const updateItem = (items, update) => {
  const index = items.findIndex((item) => item.id === update.id);

  if (index === -1) {
    return items
  }

  return [
    ...items.slice(0, index),
    update,
    ...items.slice(index + 1),
  ];
};

const sortBouquetsByPriceUp = (bouquetA, bouquetB) => bouquetA.price - bouquetB.price;

const sortBouquetsByPriceDown = (bouquetA, bouquetB) => bouquetB.price - bouquetA.price;

export {updateItem, sortBouquetsByPriceUp, sortBouquetsByPriceDown};
