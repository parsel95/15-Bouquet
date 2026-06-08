export const createFilterReasonItemTemplate = (currentType, type, text, index) =>
  `
    <div
      class="
        filter-field-text
        filter-reason__form-field--for-${type}
        filter-reason__form-field
      "
    >
      <input
        class="
          filter-field-text__input
          filter-reason__form-field--for-${type}
          filter-reason__form-field
        "
        type="radio"
        id="filter-reason-field-id-${index}"
        name="reason"
        value="for-${type}"
        ${currentType === type ? 'checked' : ''}
      >

      <label
        class="filter-field-text__label"
        for="filter-reason-field-id-${index}"
      >

        <span class="filter-field-text__text">${text}</span>
      </label>
    </div>
  `;
