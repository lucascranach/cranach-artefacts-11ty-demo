exports.data = {
  layout: "graphic-virtual-object.11ty.js",
  lang: "de",
  collectionID: "graphicsVirtualObjectsDE",
  entityType: "graphicsVirualObject",
  pagination: {
    data: "collections.graphicsVirtualObjectsDE",
    size: 1,
    alias: "graphicsMasterData",
    currentCollection: "collections.graphicsVirtualObjectsDE",
  },
  permalink: function (data) {
    const item = data.pagination.items[0];
    return `/${data.lang}/graphics/${item.metadata.id}/`;
  }
};

exports.render = (data) => {
  return data.pagination.items[0];
};


