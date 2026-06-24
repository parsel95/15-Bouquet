import '../vendor/swiper.js';

export default class ImageSlider {
  constructor(sliderElement) {
    this.sliderElement = sliderElement;
  }

  init() {

      this.slider = new Swiper(this.sliderElement, {//eslint-disable-line
        slidesPerView: 1,
        spaceBetween: 100,
        speed: 700,
        navigation: {
          nextEl: '.image-slider__button--next',
          prevEl: '.image-slider__button--prev',
        },
        a11y: {
          prevSlideMessage: 'Предыдущий слайд',
          nextSlideMessage: 'Следующий слайд',
        },
      });

  }
}
