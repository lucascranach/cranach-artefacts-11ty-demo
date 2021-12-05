exports.getCondition = (eleventy, { content }, langCode) => {
  const conditionData = `${content.classification.classification}; ${content.classification.condition}`;
  const label = eleventy.translate('condition', langCode);
  return !content.classification.classification ? '' : `
    <dl id="conditionData" class="definition-list is-grid">
      <dt class="definition-list__term">${label}</dt>
      <dd class="definition-list__definition">
        ${conditionData}
      </dd>
    </dl>
  `;
};