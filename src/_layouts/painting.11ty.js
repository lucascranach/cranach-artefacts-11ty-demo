let langCode;
let config;

const metaDataHeader = require("./components/meta-data-head.11ty");
const improveCda = require("./components/improve-cda.11ty");
const pageDateSnippet = require("./components/pageDate.11ty");
const copyrightSnippet = require("./components/copyright.11ty");
const citeCdaSnippet = require("./components/citeCda.11ty");
const titleSnippet = require("./components/title.11ty");
const mediumSnippet = require("./components/medium.11ty");
const representantImageSnippet = require("./components/representantImage.11ty");
const attributionSnippet = require("./components/attribution.11ty");
const datingSnippet = require("./components/dating.11ty");
const signatureSnippet = require("./components/signature.11ty");
const inscriptionsSnippet = require("./components/inscriptions.11ty");
const stampsSnippet = require("./components/stamps.11ty");
const dimensionsSnippet = require("./components/dimensions.11ty");
const descriptionSnippet = require("./components/description.11ty");
const locationSnippet = require("./components/location.11ty");
const imageDescriptionSnippet = require("./components/imageDescription.11ty");
const exhibitonsSnippet = require("./components/exhibitons.11ty");
const identificationSnippet = require("./components/identification.11ty");
const provenanceSnippet = require("./components/provenance.11ty");
const sourcesSnippet = require("./components/sources.11ty");
const imageStripeSnippet = require("./components/imageStripe.11ty");
const reportsSnippet = require("./components/reports.11ty");
const additionalTextInformationSnippet = require("./components/additionalTextInformation.11ty");
const referencesSnippet = require("./components/references.11ty");

const ART_TECH_EXAMINATION = 'ArtTechExamination';
const CONDITION_REPORT = 'ConditionReport';
const CONSERVATION_REPORT = 'ConservationReport';
const RELATED_IN_CONTENT_TO = 'RELATED_IN_CONTENT_TO';
const SIMILAR_TO = 'SIMILAR_TO';
const BELONGS_TO = 'BELONGS_TO';
const GRAPHIC = 'GRAPHIC';
const PART_OF_WORK = 'PART_OF_WORK';

const getImageStack = ({ content }) => JSON.stringify(content.images);
const getImageBasePath = () => JSON.stringify(config.imageTiles);
const getClientTranslations = () => JSON.stringify(this.getClientTranslations());
const getLangCode = ({ content }) => content.metadata.langCode;
const getDocumentTitle = ({ content }) => content.metadata.title;

const getHeader = (data) => {
  const title = titleSnippet.getTitle(this, data, langCode);
  const subtitle = mediumSnippet.getMedium(this, data, langCode);
  return `
  <header class="artefact-header">
    ${title}
    ${subtitle}
  </header>`;
};

const getNavigation = () => {
  const cranachSearchURL = `${config.cranachSearchURL}/${langCode}`;
  return `
    <nav class="main-navigation js-navigation">
      <a class="logo js-home" href="${cranachSearchURL}">cda_</a>
      <a class="back icon has-interaction js-back">arrow_back</a>
    </nav>
  `;
}

const getInscriptionsOld = ({ content }) => {
  const inscriptionsHeadline = `<span class="term">${this.translate('inscriptionsInnerHeadline', langCode)}</span>`;
  const inscriptions = content.inscription ? `${inscriptionsHeadline}${content.inscription}` : false;
  const stampsHeadline = `<span class="term">${this.translate('stampsInnerHeadline', langCode)}</span>`;
  const stamps = content.markings ? `${stampsHeadline}${content.markings}` : false;
  let inscriptionsRaw = `${content.inscription}${content.markings}`.replace(/:\n/, ': ');
  inscriptionsRaw = inscriptionsRaw.replace(/\n *?\n/sg, '\n\n');

  const inscriptionItems = inscriptionsRaw.split(/\]\n\n/).map((item) => {
    const separator = item.match(/\n\n/) ? '\n\n' : '\n';
    const elements = item.split(separator);
    return { text: elements.shift(), remark: elements.join('\n') };
  });

  const numberOfWords = 20;
  const fullText = inscriptionItems[0].text;
  const words = fullText.split(/ /);
  const preview = words.length > numberOfWords ? `${words.slice(0, numberOfWords).join(' ')} …` : fullText;
  const label = this.translate('inscriptions', langCode);
  const inscriptionTable = inscriptionItems[0].text.match(/^keine$/i) ? ''
    : this.getRemarkDataTable('Inscriptions', inscriptionItems, 'inscriptions', label);
  return !inscriptionsRaw ? '' : `
    <dl id="inscriptions" class="definition-list is-grid">
      <dt class="definition-list__term">${label}</dt>
      <dd class="definition-list__definition">${preview}</dd>
    </dl>
    ${inscriptionTable}
  `;
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
  const documentTitle = getDocumentTitle(data);
  const header = getHeader(data);
  const image = representantImageSnippet.getRepresentant(this, data);
  const copy = descriptionSnippet.getCopyText(this, data, langCode);
  const dating = datingSnippet.getDating(this, data, langCode);
  const dimensions = dimensionsSnippet.getDimensions(this, data, langCode);
  const attribution = attributionSnippet.getAttribution(this, data, langCode);
  const location = locationSnippet.getLocation(this, data, langCode);
  const signature = signatureSnippet.getSignature(this, data, langCode);
  const inscription = inscriptionsSnippet.getInscriptions(this, data, langCode);
  const stamps = stampsSnippet.getStamps(this, data, langCode);
  const ids = identificationSnippet.getIds(this, data, langCode);
  const exhibitions = exhibitonsSnippet.getExhibitions(this, data, langCode);
  const provenance = provenanceSnippet.getProvenance(this, data, langCode);
  const sources = sourcesSnippet.getSources(this, data, langCode);
  const imageStack = getImageStack(data);
  const imageBasePath = getImageBasePath(data);
  const translationsClient = getClientTranslations(data);
  const imageStripe = imageStripeSnippet.getImageStripe(this, data, langCode, config);
  const artTechExaminations = reportsSnippet.getReports(this, data, langCode, config, ART_TECH_EXAMINATION);
  const conditionReport = reportsSnippet.getReports(this, data, langCode, config, CONDITION_REPORT);
  const conservationReport = reportsSnippet.getReports(this, data, langCode, config, CONSERVATION_REPORT);
  const additionalTextInformation = additionalTextInformationSnippet.getAdditionalTextInformation(this, data, langCode);
  const relatedInContentTo = referencesSnippet.getReference(this, data, langCode, RELATED_IN_CONTENT_TO);
  const similarTo = referencesSnippet.getReference(this, data, langCode, SIMILAR_TO);
  const belongsTo = referencesSnippet.getReference(this, data, langCode, BELONGS_TO);
  const graphic = referencesSnippet.getReference(this, data, langCode, GRAPHIC);
  const partOfWork = referencesSnippet.getReference(this, data, langCode, PART_OF_WORK, true);
  const imageDescriptionObjectInfo = imageDescriptionSnippet.getImageDescriptionObjectInfo(data);
  const citeCda = citeCdaSnippet.getCiteCDA(this, langCode);
  const improveCdaSnippet = improveCda.getImproveCDA(this, data, config, langCode);
  const copyright = copyrightSnippet.getCopyright();
  const pageDate = pageDateSnippet.getPageDate(this, langCode);
  const navigation = getNavigation();
  const metaDataHead = metaDataHeader.getHeader(data);


  return `<!doctype html> 
  <html lang="${langCode}">
    <head>
      <title>cda :: ${this.translate('paintings', langCode)} :: ${documentTitle}</title>
      ${metaDataHead}
      <meta name="viewport" content="width=device-width, initial-scale=1, minimum-scale=1.0, maximum-scale=1.0">
      <link href="${this.url('/compiled-assets/main.css')}" rel="stylesheet">
      <link href="${this.url('/assets/images/favicon.svg')}" rel="icon" type="image/svg">
      <script>
        const langCode = "${langCode}";
        const imageStack = ${imageStack};
        const imageBasePath = ${imageBasePath};
        const env = "${this.getENV()}";
        const translations = ${translationsClient};
        const asseturl = "${this.url('/assets')}";
      </script>
    </head>
    <body>
      <div id="page">
        ${navigation}
          <section class="leporello-recog">
          ${image}
          <div class="leporello-recog__text">
            <div class="grid-wrapper">
              ${header}
            </div>

            <div class="grid-wrapper">
              <div class="main-column">
                <div class="copytext">
                  ${copy}
                </div>
                <div class="block">
                  ${attribution}
                  ${dating}
                  ${dimensions}
                  ${signature}
                  ${inscription}
                  ${stamps}
                </div>
                <div class="block">
                  ${location}
                </div>
                <div class="block">
                  ${ids}
                </div>
              </div>

              <div class="marginal-content">
                ${provenance}
                ${exhibitions}
                ${sources}
                ${additionalTextInformation}
                ${partOfWork}
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
            ${artTechExaminations}
            ${conditionReport}
            ${conservationReport}
            ${relatedInContentTo}
            ${similarTo}
            ${belongsTo}
            ${graphic}
          </div>
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
      <script src="https://cdn.jsdelivr.net/npm/openseadragon@2.4.2/build/openseadragon/openseadragon.min.js"></script>
      <script src="${this.url('/assets/scripts/main.js')}"></script>
    </body>
  </html>`;
};
