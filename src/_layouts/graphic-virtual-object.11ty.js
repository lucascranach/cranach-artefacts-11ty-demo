let langCode;
let config;

const metaDataHeader = require("./components/meta-data-head.11ty");
const improveCda = require("./components/improve-cda.11ty");
const pageDateSnippet = require("./components/page-date.11ty");
const copyrightSnippet = require("./components/copyright.11ty");
const citeCdaSnippet = require("./components/cite-cda.11ty");
const classificationSnippet = require("./components/classification.11ty");
const titleSnippet = require("./components/title.11ty");
const masterDataSnippet = require("./components/graphic-virtual-object-master-data.11ty");

const getImageBasePath = () => JSON.stringify(config.imageTiles);
const getClientTranslations = () => JSON.stringify(this.getClientTranslations());
const getLangCode = ({ content }) => content.metadata.langCode;
const getDocumentTitle = ({ content }) => content.metadata.title;

const getHeader = (data) => {
  const title = titleSnippet.getTitle(this, data, langCode);
  const subtitle = classificationSnippet.getClassification(this, data, langCode);
  return `
  <header class="artefact-header">
    ${title}
    ${subtitle}
  </header>`;
};

const getMasterData = (data) => {
  const masterData = masterDataSnippet.getMasterData(this, data, langCode);
  const id = data.content.metadata.id;
  const masterDataFilename = `${langCode}-${id}-index.html`;
  this.writeDocument(masterDataFilename, masterData);
  return masterData;
}

const getNavigation = () => {
  const cranachSearchURL = `${config.cranachSearchURL}/${langCode}`;
  return `
    <nav class="main-navigation js-navigation">
      <a class="logo js-home" href="${cranachSearchURL}">cda_</a>
      <a class="back icon has-interaction js-back">arrow_back</a>
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

  this.log(data);
  
  const navigation = getNavigation();
  const masterData = getMasterData(data, langCode);
  const documentTitle = getDocumentTitle(data);
  const imageBasePath = getImageBasePath(data);
  const metaDataHead = metaDataHeader.getHeader(data);
  const translationsClient = getClientTranslations(data);
  const citeCda = citeCdaSnippet.getCiteCDA(this, langCode);
  const improveCdaSnippet = improveCda.getImproveCDA(this, data, config, langCode);
  const copyright = copyrightSnippet.getCopyright();
  const pageDate = pageDateSnippet.getPageDate(this, langCode);

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
        <section class="leporello-explore">

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
