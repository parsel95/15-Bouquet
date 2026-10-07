export const createModalSliderImgTemplate = (picture, authorPhoto, index) => {
  const getAuthorElement = (author, idx) => idx === 0 ?
    `<span class="image-author image-slide__author">
      Автор  фотографии: «${author}»
    </span>`
    : '';

  return `
    <div class="image-slides-list__item swiper-slide">
      <div class="image-slide">
        <img src="${picture}" alt="">
        ${getAuthorElement(authorPhoto, index)}
      </div>
    </div>
  `;
};


