const setToZeroOpacity = (element, time) => {
  element.style.transition = `opacity ${time}s ease`;
  element.style.opacity = '0';
}

const setToFullOpacity = (element) => {
  element.style.opacity = '1';
}

export {
  setToZeroOpacity,
  setToFullOpacity
}
