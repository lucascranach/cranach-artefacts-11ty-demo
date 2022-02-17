exports.getAdditionalTextInformation = (eleventy, { content }) => {
  const additionalInfos = content.additionalTextInformation;
  const additionalInfoTypes = additionalInfos.map((item) => item.type);
  // eslint-disable-next-line max-len
  const uniqueAdditionalInfoTypes = additionalInfoTypes.filter((item, index) => additionalInfoTypes.indexOf(item) === index);
  const getTypeContent = (type) => {
    const typeContent = additionalInfos.filter((item) => item.type === type);
    return typeContent.length === 0 ? '' : typeContent.map((item) => {
      const formatedText = eleventy.getFormatedText(item.text);
      return `
        <div class="block has-padding">
          ${formatedText}
        </div>
      `;
    });
  };
  return uniqueAdditionalInfoTypes.length === 0 ? '' : uniqueAdditionalInfoTypes.map((type) => `
    <div class="foldable-block has-strong-separator">
        <h2 class="foldable-block__headline is-expand-trigger" data-js-expanded="false" data-js-expandable="${eleventy.slugify(type)}">${type}</h2>
        <div class="expandable-content" id="${eleventy.slugify(type)}">
          ${getTypeContent(type).join('')}
        </div>
      </div>
    `);
};
