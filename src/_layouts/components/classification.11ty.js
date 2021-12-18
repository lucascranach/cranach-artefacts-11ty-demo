exports.getClassification = (eleventy, { content }, langCode) => {
  const prefix = content.metadata.id;
  const classification = content.metadata.classification;
  const structuredClassificationData = eleventy.getStructuredDataFromString(classification);
  const visibleContent = structuredClassificationData[0].text;
  const hasAdditionalContent = !!(structuredClassificationData.length >= 1 && structuredClassificationData[0].remark.match(/[a-z]/));
  const label = eleventy.translate('classification', langCode);
  const classificationTable = hasAdditionalContent ? eleventy.getRemarkDataTable('Classification', structuredClassificationData, `${prefix}-subtitle`, label, prefix) : '';
  return !classification ? '' : `
    <div class="has-tight-separator">
      <div id="${prefix}-subtitle">
        <p class="subtitle">${visibleContent}</p>
      </div>
      ${classificationTable}
    </div>
  `;
};