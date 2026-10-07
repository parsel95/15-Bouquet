/**
 * Блокирует прокрутку страницы, сохраняя текущую позицию.
 *
 * При блокировке компенсирует ширину полосы прокрутки у body
 * и элементов с data-fix-block, чтобы содержимое не смещалось.
 * При снятии блокировки восстанавливает позицию прокрутки и стили.
 */
export default class ScrollLock {
  #lockClass = 'scroll-lock';
  #scrollTop = null;
  #fixedBlockElements = document.querySelectorAll('[data-fix-block]');

  #getScrollbarWidth() {
    return window.innerWidth - document.documentElement.clientWidth;
  }

  #getScrollTop() {
    return window.scrollY;
  }

  disableScrolling() {
    const scrollTop = document.body.dataset.scroll || this.#getScrollTop();
    const scrollbarWidth = this.#getScrollbarWidth();

    this.#scrollTop = Number(scrollTop);
    document.body.dataset.scroll = this.#scrollTop;

    if (scrollbarWidth) {
      document.body.style.paddingRight = `${scrollbarWidth}px`;

      this.#fixedBlockElements.forEach((block) => {
        block.style.paddingRight = `${scrollbarWidth}px`;
      });
    }

    document.body.style.top = `-${this.#scrollTop}px`;
    document.body.classList.add(this.#lockClass);
  }

  enableScrolling() {
    document.body.classList.remove(this.#lockClass);
    window.scrollTo(0, this.#scrollTop);

    document.body.style.paddingRight = '';
    document.body.style.top = '';

    this.#fixedBlockElements.forEach((block) => {
      block.style.paddingRight = '';
    });

    document.body.removeAttribute('data-scroll');
    this.#scrollTop = null;
  }
}
