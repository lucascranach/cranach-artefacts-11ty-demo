exports.getSignature = (eleventy, { content }, langCode) => {
  const prefix = content.metadata.id;
  const signatureItems = content.signature.split(/\n/);
  const label = eleventy.translate('signature', langCode);
  const signatureTable = signatureItems[0].match(/^keine$|none$/i) ? '' : eleventy.getDataList('Signature', signatureItems, `${prefix}-signature`, label, prefix);
  return !content.signature ? '' : `
    <dl id="${prefix}-signature" class="definition-list is-grid">
      <dt class="definition-list__term">${label}</dt>
      <dd class="definition-list__definition">${signatureItems[0]}</dd>
    </dl>
    ${signatureTable}
  `;
};