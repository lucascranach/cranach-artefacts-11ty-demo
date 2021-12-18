exports.getAttribution = (eleventy, { content }, langCode) => {
  const prefix = content.metadata.id;
  const numberOfItems = 2;
  const getAttributer = (item) => {
    const fragments = [];
    if (item.prefix) fragments.push(item.prefix);
    if (item.name) fragments.push(item.name);
    if (item.suffix) fragments.push(item.suffix);
    return fragments.join(' ');
  };
  const attributionShortListItems = content.involvedPersons.slice(0, numberOfItems);
  const attributionShortList = attributionShortListItems.map((item) => getAttributer(item));
  const attributionFullList = content.involvedPersons.map((item) => ({ text: `${getAttributer(item)}`, remark: item.remarks }));
  const label = content.involvedPersons.length > 1 ? eleventy.translate('attributions', langCode) : eleventy.translate('attribution', langCode);
  const allAttributions = eleventy.getRemarkDataTable('Attributions', attributionFullList, `${prefix}-attributionData`, label, prefix);

  return content.involvedPersons.length === 0 ? '' : `
    <dl id="${prefix}-attributionData" class="definition-list is-grid">
      <dt class="definition-list__term">${label}</dt>
      <dd class="definition-list__definition">
        ${attributionShortList.join('<br>')}
      </dd>
    </dl>
    ${allAttributions}
  `;
};