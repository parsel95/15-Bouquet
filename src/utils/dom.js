const setInertOnChildrenExcept = (container, excludedElement, isInert) => {
  Array.from(container.children).forEach((element) => {
    if (element !== excludedElement) {
      element.inert = isInert;
    }
  });
};

export {setInertOnChildrenExcept};
