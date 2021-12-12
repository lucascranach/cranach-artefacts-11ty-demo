let langCode;
let config;

const metaDataHeader = require("./components/meta-data-head.11ty");
const improveCda = require("./components/improve-cda.11ty");
const pageDateSnippet = require("./components/page-date.11ty");
const copyrightSnippet = require("./components/copyright.11ty");
const citeCdaSnippet = require("./components/cite-cda.11ty");
const masterDataSnippet = require("./components/graphic-virtual-object-master-data.11ty");
const graphicsRealObject = require("./components/graphic-real-object.11ty");

const getImageBasePath = () => JSON.stringify(config.imageTiles);
const getClientTranslations = () => JSON.stringify(this.getClientTranslations());
const getLangCode = ({ content }) => content.metadata.langCode;
const getDocumentTitle = ({ content }) => content.metadata.title;

const generateReprint = (eleventy, id, langCode, masterData) => { 
  const data = {
    content: eleventy.getReprintData(id, langCode)
  };
  const path = `${config.dist}/${langCode}/${config.graphicFolder}/${id}`;
  const filename = "index.html";
  const reprint = graphicsRealObject.getRealObject(eleventy, data, langCode, masterData);
  eleventy.writeDocument(path, filename, reprint);
}

const getReprints = (eleventy, { content }, langCode, conditionLevel, secondConditionLevel = false) => {
  if (!content.references.reprints) return '';
  
  const reprintsListData = [...content.references.reprints];
  const reprintsListRefData = reprintsListData.map(item => {
    return eleventy.getReprintRefItem(item.inventoryNumber, langCode, conditionLevel);
  });

  const checkConditionLevel = (item) => {
    if (!item || !item.conditionLevel) return false;
    
    const conditionLevelCheck = secondConditionLevel
      ? item.conditionLevel === conditionLevel || item.conditionLevel === secondConditionLevel
      : item.conditionLevel === conditionLevel;
    
    return conditionLevelCheck;
  }
    
  const reprints = reprintsListRefData.filter(checkConditionLevel);
  const state = eleventy.translate(`${conditionLevel}-state`, langCode);
  const masterData = content.masterData;

  const reprintsList = reprints.map(
    (item) => {
      generateReprint(eleventy, item.id, langCode, masterData);
      const url = `../${item.id}/index.html`;
      const title = eleventy.altText(item.title);
      const cardText = [];
      if (item.date) cardText.push(item.date);
      if (item.repository) cardText.push(item.repository);
      return `
        <figure class="artefact-card">
          <a href="${url}" class="js-go-to-reprint">
            <div class="artefact-card__image-holder">
              <img src="${item.imgSrc}" alt="${title}" loading="lazy">
            </div>
            <figcaption class="artefact-card__content">
              <p class="artefact-card__text">${cardText.join(", ", cardText)}</p>
            </figcaption>
          </a>
        </figure>
      `;
    }
  );

  return reprints.length === 0 ? '' : `
    <div class="reprints-block block">
      <h3 class="reprints-state">${state}</h3>
      <div class="artefact-overview">
        ${reprintsList.join("")}
      </div>
    </div>
  `;
}

const getMasterData = (data) => {
  const masterData = masterDataSnippet.getMasterData(this, data, langCode);
  return masterData;
}

const getNavigation = () => {
  const cranachSearchURL = `${config.cranachSearchURL}/${langCode}`;
  return `
    <nav class="main-navigation js-navigation">
      <div>
        <a class="logo js-home" href="${cranachSearchURL}">cda_</a>
        <a class="back icon has-interaction js-back">arrow_back</a>
      </div>
      <h2>${this.translate('masterData', langCode)}</h2>
    </nav>
  `;
}

// eslint-disable-next-line func-names
exports.render = function (pageData) {
  const data = pageData;
  langCode = getLangCode(data);
  config = this.getConfig();

  data.content.currentCollection = data.collections[data.collectionID];
  data.content.entityType = data.entityType;
  data.content.url = `${this.getBaseUrl()}${data.page.url}`;
  data.content.masterData = getMasterData(data, langCode);
  this.log(data);
  
  const navigation = getNavigation();
  const masterData = data.content.masterData;
  const documentTitle = getDocumentTitle(data);
  const imageBasePath = getImageBasePath(data);
  const metaDataHead = metaDataHeader.getHeader(data);
  const translationsClient = getClientTranslations(data);
  const citeCda = citeCdaSnippet.getCiteCDA(this, langCode);
  const improveCdaSnippet = improveCda.getImproveCDA(this, data, config, langCode);
  const copyright = copyrightSnippet.getCopyright();
  const pageDate = pageDateSnippet.getPageDate(this, langCode);
  const reprintsLevel1 = getReprints(this, data, langCode, 1, 0);
  const reprintsLevel2 = getReprints(this, data, langCode, 2);
  const reprintsLevel3 = getReprints(this, data, langCode, 3);
  const reprintsLevel4 = getReprints(this, data, langCode, 4);
  const reprintsLevel5 = getReprints(this, data, langCode, 5);

  return `<!doctype html> 
  <html lang="${langCode}">
    <head>
      <title>cda :: ${this.translate('prints', langCode)} :: ${documentTitle}</title>
      ${metaDataHead}
      <meta name="viewport" content="width=device-width, initial-scale=1, minimum-scale=1.0, maximum-scale=1.0">
      <link href="${this.url('/compiled-assets/main.css')}" rel="stylesheet">
      <link href="${this.url('/assets/images/favicon.svg')}" rel="icon" type="image/svg">
      <script>
        const langCode = "${langCode}";
        const imageStack = false;
        const imageBasePath = ${imageBasePath};
        const env = "${this.getENV()}";
        const translations = ${translationsClient};
        const asseturl = "${this.url('/assets')}";
      </script>
    </head>
    <body>
      <div id="page">
        ${navigation}
        ${masterData}
        <section id="reprints" class="leporello-reprints">
          <h2 class="leporello-reprints__headline">${this.translate('impressions', langCode)}</h2>
          ${reprintsLevel1}
          ${reprintsLevel2}
          ${reprintsLevel3}
          ${reprintsLevel4}
          ${reprintsLevel5}
        </section>
          <section class="final-words">
          <div class="text-block">
            ${citeCda}
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
      <script src="${this.url('/assets/scripts/main.js')}"></script>
    </body>
  </html>`;
};
