exports.getTitle = (eleventy, { content }, langCode) => {
  const prefix = content.metadata.id;
  const titleList = content.titles.map((item) => ({ text: item.title, remark: item.remarks }));
  const label = titleList.length > 1 ? eleventy.translate('titles', langCode) : eleventy.translate('title', langCode);
  const allTitles = eleventy.getRemarkDataTable('Titles', titleList, `${prefix}-mainTitle`, label, prefix);
  return `
    <h1 id="${prefix}-mainTitle" class="title">${content.metadata.title}</h1>
    ${allTitles}
  `;
};