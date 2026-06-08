import AbstractView from '../../framework/view/abstract-view.js';

export const createModalSliderImgTemplate = (picture, authorPhoto, index) => {
  const getAuthorElement = (authorPhoto, index) => {
    return index === 0 ?
      `<span class="image-author image-slide__author">Автор  фотографии: «${authorPhoto}»</span>`
      : '0';
  };

  return `
    <div class="image-slides-list__item swiper-slide">
      <div class="image-slide">
        <img src="${picture}" alt="">
        ${getAuthorElement(authorPhoto, index)}
      </div>
    </div>
  `;
}


