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
  return `
  <header class="artefact-header">
    ${title}
  </header>`;
};

const getLiterature = (data, langCode, baseUrl) => {
  const author = data.content.title;
  const literature = this.getLiteratureByAuthor(author, langCode);
  
  if(!literature) return '';

  const sortedLiterature = literature.sort((a, b) => {
    const dateA = a.publishDate ? a.publishDate : a.date;
    const dateB = b.publishDate ? b.publishDate : b.date;
    return dateB - dateA;
  });

  const literatureList = sortedLiterature.map((item) => {
    const {referenceId} = item;
    const {referenceNumber} = item;
    const title = item.title.replace(/<(.*?)>/g, '');
    const {authors} = item;
    const {publishLocation} = item;
    const {publishDate} = item;
    const literatureObjectLink = `${baseUrl}/${langCode}/literature-${referenceId}/`;

    return `
      <tr class="row">
        <th class="cell"><a class="link" href="${literatureObjectLink}">${title}</a></th>
        <td class="cell">${referenceNumber}</td>
        <td class="cell">${authors}</td>
        <td class="cell">${publishLocation}</td>
        <td class="cell">${publishDate}</td>
      </tr>
    `;
  });
  return `
    <table class="table is-striped">
      <tbody class="body">
      ${literatureList.join('')}
      </tbody>
    </table>`;
};

const getArtefacts = (data, langCode, baseUrl) => {
  const artefacts = data.content.connectedObjects;
  if(!artefacts) return '';
  const artefactList = artefacts.map((artefact) => {
    
    const {inventoryNumber} = artefact;
    const artefactData = this.getPainting(inventoryNumber, langCode);
    if(!artefactData) return '';

    const artefactObjectLink = `${baseUrl}/${langCode}/${artefactData.metadata.id}/`;
    const referenceOnPage =  artefact.pageNumber 
      ? `<li class="related-item__text">${this.translate('referenceOnPage', langCode)}: ${artefact.pageNumber}</li>`
      : '';
    const catalogueNumber =  artefact.catalogNumber 
      ? `<li class="related-item__text">${this.translate('catalogueNumber', langCode)}: ${artefact.catalogNumber}</li>`
      : '';
    const figureNumber =  artefact.figureNumber 
      ? `<li class="related-item__text">${this.translate('figurePlate', langCode)}: ${artefact.figureNumber}</li>`
      : '';

    return `
    <li class="related-item-wrap">
      <a href="${artefactObjectLink}">
        <figure class="related-item">
          <div class="related-item__image">
            <img loading="lazy" src="${this.url(artefactData.metadata.imgSrc)}" alt="${artefactData.metadata.title}">
          </div>
          <figcaption class="related-item__caption">
            <ul>
              <li class="related-item__title">${artefactData.metadata.title}</li>
              <li class="related-item__text">${artefactData.repository}</li>
              ${referenceOnPage}
              ${catalogueNumber}
              ${figureNumber}
            </ul>
          </figcaption>
        </figure>
      </a>  
    </li>
    `;
  });
  return `<ul class="artefact-list">${artefactList.join('')}</ul>`;
};

// eslint-disable-next-line func-names
exports.render = function (pageData) {
  const data = pageData;
  langCode = getLangCode(data);
  config = this.getConfig();
  const baseUrl = this.getBaseUrl();

  data.content.currentCollection = data.collections[data.collectionID];
  data.content.entityType = data.entityType;
  data.content.url = `${this.getBaseUrl()}${data.page.url}`;

  this.log(data);

  const { id } = data.content.metadata;
  const documentTitle = getDocumentTitle(data);
  const header = getHeader(data);

  data.content.description = `${data.content.textCategory}, ${data.content.shortTitle}, ${data.content.authors}`;
  const metaDataHead = metaDataHeader.getHeader(data);
  const literature = getLiterature(data, langCode, baseUrl);
  const artefacts = getArtefacts(data, langCode, baseUrl);

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

    </head>
    <body>
      <div id="page">
      ${navigation}
        <section class="literature-page js-main-content">
          <div class="grid-wrapper">
            ${header}
          </div>
          <div class="grid-wrapper">
            ${literature}
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
