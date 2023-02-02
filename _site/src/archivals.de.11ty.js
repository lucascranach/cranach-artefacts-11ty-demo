exports.data = {
  layout: "archival-item.11ty.js",
  lang: "de",
  collectionID: "archivalsDE",
  entityType: "archivals",
  pagination: {
    data: "collections.archivalsDE",
    size: 1,
    alias: "archival",
    currentCollection: "collections.archivalsDE",
  },
  permalink: function(data){
    const item = data.pagination.items[0];
    return `/${data.lang}/${item.metadata.id}/`;
  }
};

exports.render = (data) => {
  return data.pagination.items[0];
};


