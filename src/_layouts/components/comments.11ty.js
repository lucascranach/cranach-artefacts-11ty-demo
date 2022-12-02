exports.getComments = (eleventy, { content }, langCode) => {
  const prefix = content.metadata.id;
  const commentsItems = content.comments.split(/\n/);
  if(commentsItems[0] === '') return '';
  const label = eleventy.translate('comments', langCode);
  const dataListData = {
    id: 'Comments',
    content: commentsItems,
    isAdditionalContentTo: `${prefix}-comments`,
    title: label,
    context: prefix,
  };
  const commentsTable = eleventy.getDataList(dataListData);

  return !content.transcription ? '' : `
    <dl id="${prefix}-comments" class="definition-list is-grid">
      <dt class="definition-list__term">${label}</dt>
      <dd class="definition-list__definition">${commentsItems[0]}</dd>
    </dl>
    ${commentsTable}
  `;
};
