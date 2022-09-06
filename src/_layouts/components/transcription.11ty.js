exports.getTranscription = (eleventy, { content }, langCode) => {
  const prefix = content.metadata.id;
  const transcriptionItems = content.transcription.split(/\n/);
  const label = eleventy.translate('transcription', langCode);
  const dataListData = {
    id: 'Transcription',
    content: transcriptionItems,
    isAdditionalContentTo: `${prefix}-transcription`,
    title: label,
    context: prefix,
  };
  const transcriptionTable = eleventy.getDataList(dataListData);

  return !content.transcription ? '' : `
    <dl id="${prefix}-transcription" class="definition-list is-grid">
      <dt class="definition-list__term">${label}</dt>
      <dd class="definition-list__definition">${transcriptionItems[0]}</dd>
    </dl>
    ${transcriptionTable}
  `;
};

exports.getTranscriptionMetaData = (eleventy, { content }, langCode) => {
  const transcriptionDate = !content.transcriptionDate
    ? ''
    : `
      <dt class="definition-list__term">${eleventy.translate('trans-date', langCode)}</dt>
      <dd class="definition-list__definition">${content.transcriptionDate}</dd>
    `;

  const transcribedBy = !content.transcribedBy
    ? ''
    : `
      <dt class="definition-list__term">${eleventy.translate('trans-by', langCode)}</dt>
      <dd class="definition-list__definition">${content.transcribedBy}</dd>
    `;

  const transcribedAccordingTo = !content.transcribedAccordingTo
    ? ''
    : `
      <dt class="definition-list__term">${eleventy.translate('trans-to', langCode)}</dt>
      <dd class="definition-list__definition">${content.transcribedAccordingTo}</dd>
    `;

  return `
    <dl class="definition-list is-grid">
    ${transcribedBy}
    ${transcriptionDate}
    ${transcribedAccordingTo}
    </dl>
  `;
};
