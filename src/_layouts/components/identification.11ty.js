exports.getIds = (eleventy, { content }, langCode) => `
<dl class="definition-list is-grid">
  <dt class="definition-list__term">CDA ID</dt>
  <dd class="definition-list__definition" data-clipable-content="${content.metadata.id}">${content.metadata.id}</dd>
  <dt class="definition-list__term">${eleventy.translate('objectName', langCode)}</dt>
  <dd class="definition-list__definition" data-clipable-content="${content.objectName}">${content.objectName}</dd>
  <dt class="definition-list__term">${eleventy.translate('permalink', langCode)}</dt>
  <dd class="definition-list__definition" data-clipable-content="${content.url}">${content.url}</dd>
</dl>
`;

exports.getCdaId = (eleventy, { content }, langCode) => `
<dl class="definition-list is-grid">
  <dt class="definition-list__term">CDA ID</dt>
  <dd class="definition-list__definition" data-clipable-content="${content.metadata.id}">${content.metadata.id}</dd>
</dl>
`;

