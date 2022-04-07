exports.getAttribution = (eleventy, { content }, langCode) => {
  const prefix = content.metadata.id;
  const numberOfItems = 2;
  let additionalCellClass = '';
  const getAttributer = (item) => {
    const fragments = [];
    const nameAndRole = [];
    if (item.name) nameAndRole.push(item.name);
    if (item.role) nameAndRole.push(item.role);
    if (item.prefix) fragments.push(item.prefix);
    if (nameAndRole.length > 0) {
      fragments.push(nameAndRole.join(', '));
      additionalCellClass = "is-wide";
    }
    if (item.suffix) fragments.push(item.suffix);
    return fragments.join(' ');
  };
  const attributionShortListItems = content.involvedPersons.slice(0, numberOfItems);
  const attributionShortList = attributionShortListItems.map((item) => getAttributer(item));
  const attributionFullList = content.involvedPersons.map((item) => ({ text: `${getAttributer(item)}`, remark: item.remarks }));
  const label = content.involvedPersons.length > 1 ? eleventy.translate('attributions', langCode) : eleventy.translate('attribution', langCode);
  const remarkDataTableData = {
    id: 'Attributions',
    content: attributionFullList,
    isAdditionalContentTo: `${prefix}-attributionData`,
    title: label,
    context: prefix,
    additionalCellClass,
  };
  const allAttributions = eleventy.getRemarkDataTable(remarkDataTableData);

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
