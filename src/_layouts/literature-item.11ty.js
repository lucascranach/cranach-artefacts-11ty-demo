let langCode;
let config;

const metaDataHeader = require('./components/meta-data-head.11ty');
const improveCda = require('./components/improve-cda.11ty');
const pageDateSnippet = require('./components/page-date.11ty');
const copyrightSnippet = require('./components/copyright.11ty');
const citeCdaSnippet = require('./components/cite-cda.11ty');
const titleSnippet = require('./components/title.11ty');
const navigationSnippet = require('./components/navigation.11ty');

const getLangCode = ({ content }) => content.metadata.langCode;
const getDocumentTitle = ({ content }) => content.title.replace(/<(.*?)>/g, ''); 

const getHeader = (data) => {
  const title = titleSnippet.getTitle(this, data, langCode);
  const subtitle = data.content.publications[0] ? data.content.publications[0].text : '';
  return `
  <header class="artefact-header">
    ${title}
    <h2 class="subtitle has-tight-separator">${subtitle}</h2>
  </header>`;
};

const getLiteratureItems = (data, langCode, baseUrl) => {
  const litItems = data.content.connectedObjects;
  if(!litItems) return '';

  const sortedItems = litItems.sort((a, b) => {
    if (a.pageNumber < b.pageNumber) {
      return -1;
    }
    if (a.pageNumber > b.pageNumber) {
      return 1;
    }
    return 0;
  });

  const itemList = sortedItems.map((item) => {
    
    const {inventoryNumber} = item;
    const itemData = this.getPainting(inventoryNumber, langCode);
    if(!itemData) return '';

    const itemObjectLink = `${baseUrl}/${langCode}/${itemData.metadata.id}/`;
    const referenceOnPage =  item.pageNumber ? item.pageNumber : '';
    const catalogueNumber =  item.catalogNumber ? item.catalogNumber : '';
    const figureNumber =  item.figureNumber ? item.figureNumber : '';

    return `
    <tr class="related-item-row">
      <td>
        <a href="${itemObjectLink}">
          <figure class="related-item">
            <div class="related-item__image">
              <img loading="lazy" src="${this.url(itemData.metadata.imgSrc)}" alt="${itemData.metadata.title}">
            </div>
          </figure>
        </a>
      </td>
      <td class="related-item__title">${itemData.metadata.title}</td>
      <td class="related-item__text">${itemData.repository}</td>
      <td>${referenceOnPage}</td>
      <td>${catalogueNumber}</td>
      <td>${figureNumber}</td>
    </tr>
    `;
  });
  return `<table class="literature-table sortable">
    <thead>
      <tr>
        <th></th>
        <th>${this.translate('title', langCode)}</th>
        <th>${this.translate('repository', langCode)}</th>
        <th class="dir-u">${this.translate('referenceOnPage', langCode)}</th>
        <th>${this.translate('catalogueNumber', langCode)}</th>
        <th>${this.translate('figurePlate', langCode)}</th>
      </tr>
    </thead>
    <tbody>
      ${itemList.join('')}
    </tbody>
    </table>`;
};

const getAuthors = (data, searchUrl) => {
  const authors = data.content.authors;
  if(!authors) return '';
  const cleanAuthors = authors.replace(/, /g, ',');
  const authorsList = cleanAuthors.split(/,/).map((author) => {
    return `<a class="has-interaction is-stupid-link" href="${searchUrl}?kind=literature_references&search_term=${author.replace(/ /g, "+")}">${author}</a>`;
  });
  return authorsList.join(', ');
};

// eslint-disable-next-line func-names
exports.render = function (pageData) {
  const data = pageData;
  langCode = getLangCode(data);
  config = this.getConfig();
  const baseUrl = this.getBaseUrl();
  const cranachSearchURL = config.cranachSearchURL.replace(/langCode/, langCode);

  data.content.currentCollection = data.collections[data.collectionID];
  data.content.entityType = data.entityType;
  data.content.url = `${this.getBaseUrl()}${data.page.url}`;

  this.log(data);

  const { id } = data.content.metadata;
  const documentTitle = getDocumentTitle(data);
  const header = getHeader(data);

  data.content.description = `${data.content.textCategory}, ${data.content.shortTitle}, ${data.content.authors}`;
  const metaDataHead = metaDataHeader.getHeader(data);
  const literatureItems = getLiteratureItems(data, langCode, baseUrl);

  const authors = getAuthors(data, cranachSearchURL);
  
  // const citeCda = citeCdaSnippet.getCiteCDA(this, data, langCode);
  const improveCdaSnippet = improveCda.getImproveCDA(this, data, config, langCode);
  const copyright = copyrightSnippet.getCopyright();
  const pageDate = pageDateSnippet.getPageDate(this, langCode);
  const navigation = navigationSnippet.getNavigation(this, langCode, id);

  const cranachCollectBaseUrl = this.getCranachCollectBaseUrl();
  const cranachCollectScript = config.cranachCollect.script;

  return `<!doctype html> 
  <html lang="${langCode}">
    <head>
      <title>cda :: ${this.translate('paintings', langCode)} :: ${documentTitle}</title>
      ${metaDataHead}
      <link href="${this.url('/compiled-assets/main.css')}" rel="stylesheet">
      <link href="${this.url('/assets/images/favicon.svg')}" rel="icon" type="image/svg">
      
      <script>
      const objectData = {};
      objectData.langCode = "${langCode}";
      objectData.imageStack = false;
      objectData.baseUrl = "${baseUrl}/${langCode}";
      objectData.imageBaseUrl = false;
      objectData.env = "${this.getENV()}";
      objectData.translations = false;
      objectData.asseturl = "${this.url('/assets')}";
      objectData.inventoryNumber = "${id}";
      objectData.navigationObjects = false;
    </script>

      <script src="https://cdn.jsdelivr.net/gh/tofsjonas/sortable@latest/sortable.min.js"></script>
    </head>
    <body>
      <div id="page">
      ${navigation}
        <section class="literature-page js-main-content">
          <div class="grid-wrapper">
            ${header}
          </div>
          <div class="grid-wrapper">
            <div class="main-column">
                <dl class="definition-list is-grid is-loose">
                  <dt class="definition-list__term">${this.translate('kuerzel', langCode)}</dt>
                  <dd class="definition-list__definition">${data.content.shortTitle}</dd>
                  <dt class="definition-list__term">${this.translate('author', langCode)}, ${this.translate('publisher', langCode)}</dt>
                  <dd class="definition-list__definition">${authors}</dd>
                  <dt class="definition-list__term">${this.translate('title', langCode)}</dt>
                  <dd class="definition-list__definition">${documentTitle}</dd>
                  <dt class="definition-list__term">${this.translate('publishLocation', langCode)}</dt>
                  <dd class="definition-list__definition">${data.content.publishLocation}</dd>
                  <dt class="definition-list__term">${this.translate('publishDate', langCode)}</dt>
                  <dd class="definition-list__definition">${data.content.publishDate}</dd>
                </dl>
            </div>
            <div class="marginal-content">
              ${literatureItems}
            </div>
          </div>
        </section>

        <section class="final-words">
          <div class="foldable-block text-block">
            
          </div>
          <div class="text-block">
            ${improveCdaSnippet}
          </div>
        </section>
          <footer class="main-footer">
          ${copyright}
          ${pageDate}
        </footer>

      </div>
      <script src="https://cdn.jsdelivr.net/npm/openseadragon@3.1.0/build/openseadragon/openseadragon.min.js"></script>
      <script src="${this.url('/assets/scripts/main.js')}"></script>
      <script src="${cranachCollectBaseUrl}/${cranachCollectScript}"></script>
    </body>
  </html>`;
};
