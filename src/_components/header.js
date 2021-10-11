const header = ({ content }) => {
  const title = content.metadata.title;
  const subtitle = content.medium ? `<h2 class="subtitle">${content.medium}</h2>` : '';
  return `
  <header class="artefact-header">
    <h1 class="title">${title}</h1>
    ${subtitle}
  </header>`;
}
module.exports = header;