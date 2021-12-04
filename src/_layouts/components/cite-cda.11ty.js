exports.getCiteCDA = (eleventy, langCode) => {
  const headline = eleventy.translate('citeCdaHeadline', langCode);
  const citeWithAutor = eleventy.translate('citeWithAutor', langCode);
  const citeWithAutorText = eleventy.convertTagsInText(eleventy.translate('citeWithAutorText', langCode));
  const citeWithoutAutor = eleventy.translate('citeWithoutAutor', langCode);
  const citeWithoutAutorText = eleventy.convertTagsInText(eleventy.translate('citeWithoutAutorText', langCode));
  return `
    <h2>${headline}</h2>
      <dl class="definition-list is-stacked">
      <dt class="definition-list__term">${citeWithAutor}</dt>
      <dd class="definition-list__definition">${citeWithAutorText}</dd>
      <dt class="definition-list__term">${citeWithoutAutor}</dt>
      <dd class="definition-list__definition">${citeWithoutAutorText}</dd>
    </dl>
  `;
};