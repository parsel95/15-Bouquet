import '../vendor/swiper.js';

/**
 * Управляет экземпляром Swiper, привязанным к переданному DOM-элементу.
 * destroy() освобождает экземпляр и сбрасывает ссылку на него; этот метод
 * нужно вызывать при завершении жизненного цикла View слайдера.
 */
export default class ImageSlider {
  constructor(sliderElement) {
    this.sliderElement = sliderElement;
  }

  init() {
    // eslint-disable-next-line no-undef
    this.slider = new Swiper(this.sliderElement, {
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

  destroy() {
    this.slider?.destroy();
    this.slider = null;
  }
}
