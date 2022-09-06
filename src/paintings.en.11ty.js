exports.data = {
  layout: 'painting.11ty.js',
  lang: 'en',
  collectionID: 'paintingsEN',
  entityType: 'paintings',
  pagination: {
    data: 'collections.paintingsEN',
    size: 1,
    alias: 'painting',
    currentCollection: 'collections.paintingsEN',
  },
  permalink: function(data) {
    const item = data.pagination.items[0];
    return `/${data.lang}/${item.metadata.id}/`;
  }
};

exports.render = (data) => data.pagination.items[0];
