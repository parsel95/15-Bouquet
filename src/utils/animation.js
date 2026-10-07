/**
 * Устанавливает плавный переход прозрачности и делает элемент полностью прозрачным.
 *
 * @param {HTMLElement} element Элемент, который нужно скрыть.
 * @param {number} time Длительность перехода в секундах.
 */
const setToZeroOpacity = (element, time) => {
  element.style.transition = `opacity ${time}s ease`;
  element.style.opacity = '0';
};

/**
 * Устанавливает полную непрозрачность элемента.
 *
 * @param {HTMLElement} element Элемент, который нужно показать.
 */
const setToFullOpacity = (element) => {
  element.style.opacity = '1';
};

export {
  setToZeroOpacity,
  setToFullOpacity
};
