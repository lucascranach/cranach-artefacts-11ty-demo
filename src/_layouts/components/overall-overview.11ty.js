exports.getOverallOverview = (eleventy, { content }, langCode) => {
  const imageStack = content.images;

  if(!imageStack
    || !imageStack['overall']
    || !imageStack['overall']['infos']
    || !imageStack['overall']['infos']['hasOverallOverview']) {
    return '';
  }

  const overallOverview = imageStack['overall'].images.filter(image => image.id.match(/Overall_Overview/));
  const imageData = overallOverview[0].sizes['small'];

  return `
    <figure class="overall-overview">
      <img loading="lazy" src="${eleventy.url(imageData.src)}" 
        alt="${eleventy.translate('overallViewOfThePiece', langCode)}" 
        width="${imageData.dimensions.width}" 
        height="${imageData.dimensions.height}"/>
    </figure>
  `;
};
