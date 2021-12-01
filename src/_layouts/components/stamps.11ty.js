exports.getStamps = (eleventy, { content }, langCode) => {
  let stampsRaw = `${content.markings}`.replace(/:\n/, ': ');
  stampsRaw = stampsRaw.replace(/\n *?\n/sg, '\n\n');

  const stampItems = stampsRaw.split(/\]\n\n/).map((item) => {
    const separator = item.match(/\n\n/) ? '\n\n' : '\n';
    const elements = item.split(separator);
    return { text: elements.shift(), remark: elements.join('\n') };
  });

  const numberOfWords = 20;
  const fullText = stampItems[0].text;
  const words = fullText.split(/ /);
  const preview = words.length > numberOfWords ? `${words.slice(0, numberOfWords).join(' ')} …` : fullText;
  const label = eleventy.translate('stampsInnerHeadline', langCode);
  const stampTable = stampItems[0].text.match(/^keine$/i) ? ''
    : eleventy.getRemarkDataTable('Stamps', stampItems, 'stamps', label);
  return !stampsRaw ? '' : `
    <dl id="stamps" class="definition-list is-grid">
      <dt class="definition-list__term">${label}</dt>
      <dd class="definition-list__definition">${preview}</dd>
    </dl>
    ${stampTable}
  `;
};