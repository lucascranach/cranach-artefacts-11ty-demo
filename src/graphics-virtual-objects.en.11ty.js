exports.data = {
  layout: 'graphic-virtual-object.11ty.js',
  lang: 'en',
  collectionID: 'graphicsVirtualObjectsEN',
  entityType: 'graphicsVirualObject',
  pagination: {
    data: 'collections.graphicsVirtualObjectsEN',
    size: 1,
    alias: 'graphicsMasterData',
    currentCollection: 'collections.graphicsVirtualObjectsEN',
  },
  permalink: function (data) {
    const item = data.pagination.items[0];
    return `/${data.lang}/${item.metadata.id}/`;
  },
};

exports.render = (data) => data.pagination.items[0];
