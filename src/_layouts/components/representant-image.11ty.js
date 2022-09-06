exports.getRepresentant = (eleventy, { content }) => {
  const src = content.metadata.imgSrc;
  const alt = content.metadata.title;
  return `
    <figure class="leporello-recog__image">
      <img loading="lazy" src="${src}" alt="${eleventy.altText(alt)}">
    </figure>
  `;
};