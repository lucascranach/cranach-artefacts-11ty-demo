exports.data = {
  layout: "author-item.11ty.js",
  lang: "de",
  collectionID: "authorsDE",
  entityType: "author",
  pagination: {
    data: "collections.authorsDE",
    size: 1,
    alias: "author",
    currentCollection: "collections.authorsDE",
  },
  permalink: function(data){
    const item = data.pagination.items[0];
    return `/${data.lang}/${item.id}/`;
  }
};

exports.render = (data) => {
  return data.pagination.items[0];
};


