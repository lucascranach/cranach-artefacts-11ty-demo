const getReferencesForPaintings = (eleventy, content) => {
  const partOfWorkPendants = eleventy.getPartOfWorkPendants(content.metadata.id);
  return content.references.concat(content.secondaryReferences, partOfWorkPendants);
}

const getReferencesForGraphics = (content) => {
  return content.references.relatedWorks;
}

exports.getReference = (eleventy, { content }, langCode, type, isOpen = false) => {

  const entityType = content.entityType;
  const references = entityType === "paintings"
    ? getReferencesForPaintings(eleventy, content)
    : getReferencesForGraphics(content);
  const getTypeContent = (refType) => {
    const typeContentItems = references.filter((item) => item.kind === refType);
    const typeContentItemList = typeContentItems.map((item) => {
      const refObjectMeta = eleventy.getRefObjectMeta(content.currentCollection, item.inventoryNumber);
      if (refType === 'PART_OF_WORK') { eleventy.addToPartOfWorkPendant(content.metadata.id, refObjectMeta.id); }
      const refObjectLink = `/${langCode}/${content.entityType}/${refObjectMeta.id}/`;
      return `
        <div class="related-item-wrap">
          <a href="${refObjectLink}">
          <figure class="related-item">
            <div class="related-item__image">
              <img loading="lazy" src="${refObjectMeta.imgSrc}" alt="${eleventy.altText(refObjectMeta.title)}">
            </div>
            <figcaption class="related-item__caption">
              <ul>
                <li class="related-item__title">${refObjectMeta.title}, ${refObjectMeta.date}</li>
                <li class="related-item__id">${refObjectMeta.id}</li>
                <li class="related-item__text">${refObjectMeta.classification}</li>
                <li class="related-item__text">${refObjectMeta.owner}</li>
              </ul>
            </figcaption>
          </figure>
          </a>
        </div>
      `;
    });

    const state = isOpen ? 'true' : 'false';

    return typeContentItems.length === 0 ? '' : `
      <div class="foldable-block has-strong-separator">
        <h2 class="foldable-block__headline is-expand-trigger" data-js-expanded="${state}" data-js-expandable="${eleventy.slugify(type)}">
          ${eleventy.translate(type, langCode)}</h2>
        <div class="expandable-content" id="${eleventy.slugify(type)}">
        ${typeContentItemList.join('')}
        </div>
      </div>
    `;
  };

  return getTypeContent(type);
};