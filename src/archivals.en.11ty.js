exports.data = {
  layout: "archival-item.11ty.js",
  lang: "en",
  collectionID: "archivalsEN",
  entityType: "archivals",
  pagination: {
    data: "collections.archivalsEN",
    size: 1,
    alias: "archival",
    currentCollection: "collections.archivalsEN",
  },
  permalink: function(data){
    const item = data.pagination.items[0];
    return `/${data.lang}/${item.metadata.id}/`;
  }
};

exports.render = (data) => {
  return data.pagination.items[0];
};


