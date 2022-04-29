let langCode;
let config;

const metaDataHeader = require('./components/meta-data-head.11ty');
const improveCda = require('./components/improve-cda.11ty');
const pageDateSnippet = require('./components/page-date.11ty');
const copyrightSnippet = require('./components/copyright.11ty');
const citeCdaSnippet = require('./components/cite-cda.11ty');
const titleSnippet = require('./components/title.11ty');
const representantImageSnippet = require('./components/representant-image.11ty');
const datingSnippet = require('./components/dating.11ty');
const signatureSnippet = require('./components/signature.11ty');
const imageDescriptionSnippet = require('./components/image-description.11ty');
const exhibitonsSnippet = require('./components/exhibitons.11ty');
const identificationSnippet = require('./components/identification.11ty');
const provenanceSnippet = require('./components/provenance.11ty');
const sourcesSnippet = require('./components/sources.11ty');
const imageStripeSnippet = require('./components/image-stripe.11ty');
const navigationSnippet = require('./components/navigation.11ty');
const locationSnippet = require('./components/location.11ty');
const transcriptionSnippet = require('./components/transcription.11ty');
const commentsSnippet = require('./components/comments.11ty');

const getImageStack = ({ content }) => JSON.stringify(content.images);
const getimageBaseUrl = () => JSON.stringify(config.imageTiles);
const getClientTranslations = () => JSON.stringify(this.getClientTranslations());
const getLangCode = ({ content }) => content.metadata.langCode;
const getDocumentTitle = ({ content }) => content.metadata.title;

const getHeader = (data) => {
  const title = titleSnippet.getTitle(this, data, langCode);
  return `
  <header class="artefact-header">
    ${title}
  </header>`;
};

// eslint-disable-next-line func-names
exports.render = function (pageData) {
  const data = pageData;
  langCode = getLangCode(data);
  config = this.getConfig();

  data.content.currentCollection = data.collections[data.collectionID];
  data.content.entityType = data.entityType;
  data.content.url = `${this.getBaseUrl()}${data.page.url}`;

  this.log(data);

  const { id } = data.content.metadata;
  const documentTitle = getDocumentTitle(data);
  const header = getHeader(data);
  const imageStack = getImageStack(data);
  const baseUrl = this.getBaseUrl();
  const imageBaseUrl = getimageBaseUrl(data);
  const translationsClient = getClientTranslations(data);

  const location = locationSnippet.getArchivalLocation(this, data, langCode);
  const metaDataHead = metaDataHeader.getHeader(data);
  const image = representantImageSnippet.getRepresentant(this, data);
  const dating = datingSnippet.getDating(this, data, langCode);
  const signature = signatureSnippet.getSignature(this, data, langCode);
  const ids = identificationSnippet.getIds(this, data, langCode);
  const exhibitions = exhibitonsSnippet.getExhibitions(this, data, langCode);
  const provenance = provenanceSnippet.getProvenance(this, data, langCode);
  const sources = sourcesSnippet.getCombinedSources(this, data, langCode);
  const imageStripe = imageStripeSnippet.getImageStripe(this, data, langCode, config);
  const imageDescriptionObjectInfo = imageDescriptionSnippet.getImageDescriptionObjectInfo(data);
  const citeCda = citeCdaSnippet.getCiteCDA(this, data, langCode);
  const improveCdaSnippet = improveCda.getImproveCDA(this, data, config, langCode);
  const copyright = copyrightSnippet.getCopyright();
  const pageDate = pageDateSnippet.getPageDate(this, langCode);
  const navigation = navigationSnippet.getNavigation(this, langCode, id);
  const navigationObjects = JSON.stringify(this.getObjectsForNavigation(data.content.metadata.id));
  const transcription = transcriptionSnippet.getTranscription(this, data, langCode);
  const transcriptionMetaData = transcriptionSnippet.getTranscriptionMetaData(this, data, langCode);
  const comments = commentsSnippet.getComments(this, data, langCode);

  return `<!doctype html> 
  <html lang="${langCode}">
    <head>
      <title>cda :: ${this.translate('paintings', langCode)} :: ${documentTitle}</title>
      ${metaDataHead}
      <meta name="viewport" content="width=device-width, initial-scale=1, minimum-scale=1.0, maximum-scale=1.0">
      <link href="${this.url('/compiled-assets/main.css')}" rel="stylesheet">
      <link href="${this.url('/assets/images/favicon.svg')}" rel="icon" type="image/svg">
      <script>
        const objectData = {};
        objectData.langCode = "${langCode}";
        objectData.imageStack = ${imageStack};
        objectData.baseUrl = "${baseUrl}/${langCode}";
        objectData.imageBaseUrl = ${imageBaseUrl};
        objectData.env = "${this.getENV()}";
        objectData.translations = ${translationsClient};
        objectData.asseturl = "${this.url('/assets')}";
        objectData.inventoryNumber = "${id}";
        objectData.navigationObjects = '${navigationObjects}';
      </script>
    </head>
    <body>
      <div id="page">
        ${navigation}
          <section class="leporello-recog js-main-content">
          ${image}
          <div class="leporello-recog__text">
            <div class="grid-wrapper">
              ${header}
            </div>

            <div class="grid-wrapper">
              <div class="main-column">
                <div class="copytext">
                  
                </div>
                <div class="block">
                  ${dating}
                  ${signature}
                </div>
                <div class="block">
                  ${location}
                </div>
                <div class="block">
                  ${ids}
                </div>

                <div class="block">
                  ${comments}
                </div>
                <div class="block">
                  ${transcription}
                  ${transcriptionMetaData}
                </div>
              </div>

              <div class="marginal-content">
                ${provenance}
                ${exhibitions}
                ${sources}
              </div>
            </div>
          </div>
        </section>

        <section class="leporello-explore">
          <div class="main-image-wrap">
            <figure class="main-image">
              <div class="image-viewer">
                <div id="viewer-content" class="image-viewer__content"></div>
              </div>
              <figcaption class="image-caption-wrap">
                ${imageDescriptionObjectInfo}
                <div id="image-caption" class="image-caption is-secondary has-seperator foldable-block"></div>
              </figcaption>
            </figure>
          </div>
          <div class="explore-content">
            ${imageStripe}
          </div>
        </section>
        <section class="final-words">
          <div class="foldable-block text-block">
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
      <script src="https://cdn.jsdelivr.net/npm/openseadragon@2.4.2/build/openseadragon/openseadragon.min.js"></script>
      <script src="${this.url('/assets/scripts/main.js')}"></script>
    </body>
  </html>`;
};
