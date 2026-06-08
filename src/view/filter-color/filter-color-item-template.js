export const createFilterColorItemTemplate = (currentType, type, text, index) =>
  `
   <div class="filter-field-img filter-color__form-field">
      <input
        class="
          filter-field-img__input
          filter-color__form-field
        "
        type="checkbox"
        id="filter-colors-field-id-${index}"
        name="colors"
        value="color-${type}"
        ${currentType === type ? 'checked' : ''}
        data-filter-color="color-${type}"
      >

      <label class="filter-field-img__label" for="filter-colors-field-id-${index}">
        <span class="filter-field-img__img">
          <picture>
            <source type="image/webp" srcset="img/content/filter-${type}.webp, img/content/filter-${type}@2x.webp 2x"><img src="img/content/filter-${type}.png" srcset="img/content/filter-${type}@2x.png 2x" width="130" height="130" alt="${text}">
          </picture>
        </span>

        <span class="filter-field-img__text">${text}</span>
      </label>
   </div>
  `;
