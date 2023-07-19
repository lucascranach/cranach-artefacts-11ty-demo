exports.data = {
  layout: 'literature-item.11ty.js',
  lang: 'en',
  collectionID: 'literatureEN',
  entityType: 'literature',
  pagination: {
    data: 'collections.literatureEN',
    size: 1,
    alias: 'literature',
    currentCollection: 'collections.literatureEN',
  },
  permalink: function(data) {
    const item = data.pagination.items[0];
    return `/${data.lang}/literature-${item.referenceId}/`;
  }
};

exports.render = (data) => data.pagination.items[0];
