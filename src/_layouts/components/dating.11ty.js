exports.getDating = (eleventy, { content }, langCode) => {
  const prefix = content.metadata.id;
  const numberOfItems = 2;
  const combinedDates = [
    { text: content.dating.dated, remarks: content.dating.remarks },
    ...content.dating.historicEventInformations,
  ];
  const datesShortListItems = combinedDates.slice(0, numberOfItems);
  const datesShortList = datesShortListItems.map((item) => item.text);
  const datesFullList = combinedDates.map((item) => ({ text: `${item.text}`, remark: item.remarks }));
  const label = datesFullList.length > 1 ? eleventy.translate('productionDates', langCode) : eleventy.translate('productionDate', langCode);
  const allDates = eleventy.getRemarkDataTable('Dates', datesFullList, `${prefix}-dataList`, label, prefix);

  return datesShortListItems.length === 0 ? '' : `
    <dl id="${prefix}-dataList" class="definition-list is-grid">
      <dt class="definition-list__term">${label}</dt>
      <dd class="definition-list__definition">${datesShortList.join('<br>')}</dd>
    </dl>

    ${allDates}
  `;
};