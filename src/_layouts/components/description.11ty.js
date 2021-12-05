exports.getCopyText = (eleventy, { content }, langCode) => {
  const numberOfWords = 50;
  const fullText = content.description;
  const words = fullText.split(/ /);
  const preview = words.slice(0, numberOfWords).join(' ');
  const text = words.length > numberOfWords ? `
    <div id="switchableCopyText" data-js-switchable-content='["previewText","fullText"]'>
      <div id="previewText" class="preview-text">${eleventy.getFormatedText(preview)}</div>
      <div class="is-cut full-text" id="fullText">${eleventy.getFormatedText(fullText)}</div>
    </div>
    ` : `
      ${eleventy.getFormatedText(fullText)}
    `;
  return !content.description ? '' : text;
};

exports.getShortDescription = (eleventy, { content }, langCode) => {
  const numberOfWords = 20;
  const descriptionRaw = content.description;
  const words = descriptionRaw.split(/ /);
  const preview = words.slice(0, numberOfWords).join(' ');
  const label = eleventy.translate('shortDescription', langCode);
  const hasAdditionalContent = words.length > numberOfWords;
  const descriptionFulltext = hasAdditionalContent ? eleventy.getDataList('Description', descriptionRaw, 'description', label) : '';
  return !content.description ? '' :
    `
    <dl id="description" class="definition-list is-grid">
      <dt class="definition-list__term">${label}</dt>
      <dd class="definition-list__definition">${preview}</dd>
    </dl>
    ${descriptionFulltext}
    `;
};

