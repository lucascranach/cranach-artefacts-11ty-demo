exports.getSignature = (eleventy, { content }, langCode) => {
  const signatureItems = content.signature.split(/\]\n\n/).map((item) => {
    const separator = item.match(/\n\n/) ? '\n\n' : '\n';
    const elements = item.split(separator);
    return { text: elements.shift(), remark: elements.join('\n') };
  });
  const label = eleventy.translate('signature', langCode);
  const signatureTable = signatureItems[0].text.match(/^keine$|none$/i) ? '' : eleventy.getRemarkDataTable('Signature', signatureItems, 'signature', label);
  return !content.signature ? '' : `
    <dl id="signature" class="definition-list is-grid">
      <dt class="definition-list__term">${label}</dt>
      <dd class="definition-list__definition">${signatureItems[0].text}</dd>
    </dl>
    ${signatureTable}
  `;
};