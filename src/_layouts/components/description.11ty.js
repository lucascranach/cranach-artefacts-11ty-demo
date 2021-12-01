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