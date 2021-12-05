exports.getMediumOfPainting = (eleventy, { content }, langCode) => {
  const { medium } = content;
  const structuredMediumData = eleventy.getStructuredDataFromString(medium);
  const visibleContent = structuredMediumData[0].text;
  const hasAdditionalContent = !!(structuredMediumData.length >= 1 && structuredMediumData[0].remark.match(/[a-z]/));
  const label = eleventy.translate('medium', langCode);
  const mediumTable = hasAdditionalContent ? eleventy.getRemarkDataTable('Medium', structuredMediumData, 'subtitle', label) : '';
  return !medium ? '' : `
    <div class="has-tight-separator">
      <div id="subtitle">
        <p class="subtitle">${visibleContent}</p>
      </div>
      ${mediumTable}
    </div>
  `;
};

exports.getMediumOfGraphic = (eleventy, { content }, langCode) => {
  const { medium } = content;
  const structuredMediumData = eleventy.getStructuredDataFromString(medium);
  const visibleContent = structuredMediumData[0].text;
  const hasAdditionalContent = !!(structuredMediumData.length >= 1 && structuredMediumData[0].remark.match(/[a-z]/));
  const label = eleventy.translate('medium', langCode);
  const mediumTable = hasAdditionalContent ? eleventy.getRemarkDataTable('Medium', structuredMediumData, 'mediumData', label) : '';
  return !medium ? '' : `
    <dl id="mediumData" class="definition-list is-grid">
      <dt class="definition-list__term">${label}</dt>
      <dd class="definition-list__definition">
      ${visibleContent}
      </dd>
    </dl>
    ${mediumTable}
  `;
};