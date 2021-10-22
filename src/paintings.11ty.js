exports.data = {
  layout: "painting.11ty.js",
  lang: "de",
  collectionID: "paintingsDEall",
  pagination: {
    data: "collections.paintingsDE",
    size: 1,
    alias: "painting",
    currentCollection: "collections.paintingsDE",
  },
  permalink: function(data){
    const item = data.pagination.items[0];
    return `/${data.lang}/paintings/${item.metadata.id}/`;
  }
};

exports.render = (data) => {
  return data.pagination.items[0];
};


