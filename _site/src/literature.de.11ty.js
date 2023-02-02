exports.data = {
  layout: 'literature-item.11ty.js',
  lang: 'de',
  collectionID: 'literatureDE',
  entityType: 'literature',
  pagination: {
    data: 'collections.literatureDE',
    size: 1,
    alias: 'literature',
    currentCollection: 'collections.literatureDE',
  },
  permalink: function(data) {
    const item = data.pagination.items[0];
    return `/${data.lang}/literature-${item.referenceId}/`;
  }
};

exports.render = (data) => data.pagination.items[0];
