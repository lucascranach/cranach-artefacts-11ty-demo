exports.getHeader = ({ content }) => {

  const descLength = 150;
  const title = content.metadata.title.replace(/"/g, '\'');
  const url = content.url;
  const image = content.metadata.imgSrc;
  const desc = content.description.length > descLength
    ? `${content.description.substr(0, descLength)} … `
    : content.description;

  return `
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
    <meta property="og:title" content="${title}" />
    <meta property="og:description" content="${desc}" />
    <meta property="og:url" content="${url}" />
    <meta property="og:image" content="${image}" />
    <meta name="description" content="${desc}">
  `;
}
