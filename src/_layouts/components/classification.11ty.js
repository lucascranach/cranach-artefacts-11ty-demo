exports.getClassification= (eleventy, { content }, langCode) => {
  const classification = content.metadata.classification;
  const structuredClassificationData = eleventy.getStructuredDataFromString(classification);
  const visibleContent = structuredClassificationData[0].text;
  const hasAdditionalContent = !!(structuredClassificationData.length >= 1 && structuredClassificationData[0].remark.match(/[a-z]/));
  const label = eleventy.translate('classification', langCode);
  const classificationTable = hasAdditionalContent ? eleventy.getRemarkDataTable('Classification', structuredClassificationData, 'subtitle', label) : '';
  return !classification ? '' : `
    <div class="has-tight-separator">
      <div id="subtitle">
        <p class="subtitle">${visibleContent}</p>
      </div>
      ${classificationTable}
    </div>
  `;
};