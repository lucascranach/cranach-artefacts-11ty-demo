exports.getCiteCDA = (eleventy, data, langCode) => {
  const headline = eleventy.translate('citeCdaHeadline', langCode);
  const citeWithAutor = eleventy.translate('citeWithAutor', langCode);
  const citeWithAutorText = eleventy.convertTagsInText(eleventy.translate('citeWithAutorText', langCode));
  const citeWithoutAutor = eleventy.translate('citeWithoutAutor', langCode);
  const citeWithoutAutorText = eleventy.convertTagsInText(eleventy.translate('citeWithoutAutorText', langCode));
  let citeTemplate = `
    <h2 class="is-expand-trigger" data-js-expanded="false" data-js-expandable="citing-hints">${headline}</h2>
    <dl id="citing-hints" class="expandable-content definition-list is-stacked">
      <dt class="definition-list__term">${citeWithAutor}</dt>
      <dd class="definition-list__definition js-date-accessed">${citeWithAutorText}</dd>
      <dt class="definition-list__term">${citeWithoutAutor}</dt>
      <dd class="definition-list__definition js-date-accessed">${citeWithoutAutorText}</dd>
    </dl>
  `;

  citeTemplate = citeTemplate.replace(/{{objectTitle}}/g, data.content.metadata.title);
  citeTemplate = citeTemplate.replace(/{{objectUrl}}/g, data.content.url);

  return citeTemplate;
};
