const getStructuredDimensions = (dimensions) => {
  const lines = dimensions.split(/\n/s);
  const dimensionData = [];
  let dimensionsPerEntry = [];
  let sourcesPerEntry = [];
  let mode = 'collectDimensions';
  const addToDimensions = (d, s) => {
    dimensionData.push({
      text: d.join('<br>'),
      remark: s.join('<br>'),
    });
    mode = 'collectDimensions';
    dimensionsPerEntry = [];
    sourcesPerEntry = [];
  };
  lines.forEach((line) => {
    if (!line.match(/[a-zA-Z]/)) return;
    if (line.match(/cm/)) {
      if (mode === 'collectSources') {
        addToDimensions(dimensionsPerEntry, sourcesPerEntry);
        mode = 'collectDimensions';
        dimensionsPerEntry = [];
        sourcesPerEntry = [];
      }
      dimensionsPerEntry.push(line);
    } else {
      mode = 'collectSources';
      sourcesPerEntry.push(line);
    }
  });
  addToDimensions(dimensionsPerEntry, sourcesPerEntry);
  return dimensionData;
};

exports.getDimensions = (eleventy, { content }, langCode) => {
  const prefix = content.metadata.id;
  const structuredDimensions = getStructuredDimensions(content.dimensions);
  const visibleContent = structuredDimensions[0].text.replace(/Maße/, '');
  const hasAdditionalContent = !!(structuredDimensions.length >= 1 && structuredDimensions[0].remark.match(/[a-z]/));
  const label = eleventy.translate('dimensions', langCode);
  const dimensionsTable = hasAdditionalContent ? eleventy.getRemarkDataTable('Dimensions', structuredDimensions, `${prefix}-dimensions`, label, prefix) : '';

  return !content.dimensions ? '' : `
    <dl id="${prefix}-dimensions" class="definition-list is-grid">
      <dt class="definition-list__term">${label}</dt>
      <dd class="definition-list__definition">${visibleContent}</dd>
    </dl>
    ${dimensionsTable}
  `;
};