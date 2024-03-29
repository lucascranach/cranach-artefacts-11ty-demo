exports.getHeader = ({ content }) => {
  const descLength = 150;
  const title = content.metadata.title.replace(/"/g, '\'').replace(/<(.*?)>/g, '');
  const { url } = content;
  const image = content.metadata.imgSrc;
  const desc = content.description && content.description.length > descLength
    ? `${content.description.substr(0, descLength)} …`
    : content.description;

  const now = new Date();
  const currentDay= now.getDate();
  const currentMonth = now.getMonth() +1;
  const currentYear = now.getFullYear();
  const currentHour = now.getHours();
  const currentMinute = now.getMinutes();
  const publishDate = `${currentYear}-${currentMonth}-${currentDay} ${currentHour}:${currentMinute} CET`;

  return `
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta property="og:title" content="${title}">
    <meta property="og:description" content="${desc}">
    <meta property="og:url" content="${url}">
    <meta property="og:image" content="${image}">
    <meta property="og:type" content="website">
    <meta name="description" content="${desc}">
    <meta property="article:published_time" content="${publishDate}">
    <meta name="author" content="Cranach Digital Archive Team // TH Köln">
  `;
};
