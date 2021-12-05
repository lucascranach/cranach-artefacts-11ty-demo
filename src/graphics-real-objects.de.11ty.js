exports.data = {
  layout: "graphic-real-object.11ty.js",
  lang: "de",
  collectionID: "graphicsRealObjectsDE",
  entityType: "graphicsRealObject",
  pagination: {
    data: "collections.graphicsRealObjectsDE",
    size: 1,
    alias: "graphic",
    currentCollection: "collections.graphicsRealObjectsDE",
  },
  permalink: function(data){
    const item = data.pagination.items[0];
    return `/${data.lang}/graphics/${item.metadata.id}/`;
  }
};

exports.render = (data) => {
  return data.pagination.items[0];
};


