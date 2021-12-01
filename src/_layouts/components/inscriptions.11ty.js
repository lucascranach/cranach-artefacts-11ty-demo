exports.getInscriptions = (eleventy, { content }, langCode) => {
  let inscriptionsRaw = `${content.inscription}`.replace(/:\n/, ': ');
  inscriptionsRaw = inscriptionsRaw.replace(/\n *?\n/sg, '\n\n');

  const inscriptionItems = inscriptionsRaw.split(/\]\n\n/).map((item) => {
    const separator = item.match(/\n\n/) ? '\n\n' : '\n';
    const elements = item.split(separator);
    return { text: elements.shift(), remark: elements.join('\n') };
  });

  const numberOfWords = 20;
  const fullText = inscriptionItems[0].text;
  const words = fullText.split(/ /);
  const preview = words.length > numberOfWords ? `${words.slice(0, numberOfWords).join(' ')} …` : fullText;
  const label = eleventy.translate('inscriptionsInnerHeadline', langCode);
  const inscriptionTable = inscriptionItems[0].text.match(/^keine$/i) ? ''
    : eleventy.getRemarkDataTable('Inscriptions', inscriptionItems, 'inscriptions', label);
  return !inscriptionsRaw ? '' : `
    <dl id="inscriptions" class="definition-list is-grid">
      <dt class="definition-list__term">${label}</dt>
      <dd class="definition-list__definition">${preview}</dd>
    </dl>
    ${inscriptionTable}
  `;
};