/**
 * Возвращает новый массив с заменённым элементом с тем же id.
 * Если элемент не найден, возвращает исходный массив без изменений.
 *
 * @param {Array<Object>} items Исходный список.
 * @param {Object} update Новая версия элемента.
 * @returns {Array<Object>} Список с заменой или исходный список.
 */
const updateItem = (items, update) => {
  const index = items.findIndex((item) => item.id === update.id);

  if (index === -1) {
    return items;
  }

  return [
    ...items.slice(0, index),
    update,
    ...items.slice(index + 1),
  ];
};

const sortByPriceUp = (bouquetA, bouquetB) => bouquetA.price - bouquetB.price;

const sortByPriceDown = (bouquetA, bouquetB) => bouquetB.price - bouquetA.price;

export {updateItem, sortByPriceUp, sortByPriceDown};
