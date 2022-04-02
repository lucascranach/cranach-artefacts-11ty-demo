exports.getImageStripe = (eleventy, { content }, langCode, config, hasSeperator = false, isExpanded = false) => {
  const imageStack = content.images;
  const { contentTypes } = config;

  const imageStripe = Object.keys(contentTypes).map((key) => {
    if (!imageStack || !imageStack[key]) return;

    const { images } = imageStack[key];
    const html = images.map((image) => {
      const title = image.metadata && image.metadata[langCode] ? eleventy.altText(image.metadata[langCode].description) : `${key}`;
      return `
        <li
          class="image-stripe-list__item has-interaction"
          title="${image.id}" 
          data-image-type="${key}" 
          data-image-id="${image.id}"
          data-js-change-image='{"key":"${key}","id":"${image.id}"}'>
          <img loading="lazy" src="${image.sizes.small.src}" alt="${title}" >
        </li>
      `;
    });
    return (html.join(''));
  });

  const availablecontentTypes = Object.keys(contentTypes).map((key) => {
    if (!imageStack || !imageStack[key]) return;
    const numberOfImages = imageStack[key].images.length;
    const type = (numberOfImages === 0) ? '' : `<option value="${key}">${eleventy.translate(key, langCode)} (${numberOfImages})</option>`;
    return type;
  });

  const imageTypeselector = `
    <div class="imagetype-selector">
      <select size="1" data-js-image-selector="true">
        <option value="all">${eleventy.translate('all', langCode)}</option>
        ${availablecontentTypes.join('')}
      </select>
    </div>
  `;

  const seperator = hasSeperator ? 'has-strong-separator' : '';
  const expanded = !!isExpanded;

  return `
    <div class="foldable-block ${seperator}">
      <h2 class="foldable-block__headline is-expand-trigger" data-js-expanded="${expanded}" data-js-expandable="image-stripe">
        ${eleventy.translate('illustrations', langCode)}</h2>
      <div id="image-stripe" class="expandable-content image-stripe">
        ${imageTypeselector}
        <ul class="image-stripe-list">
          ${imageStripe.join('')}
        </ul>
      </div>
    </div>
  `;
};
