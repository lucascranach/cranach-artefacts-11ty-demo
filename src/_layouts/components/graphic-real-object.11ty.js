let langCode;
let config;

const metaDataHeader = require("./meta-data-head.11ty");
const improveCda = require("./improve-cda.11ty");
const pageDateSnippet = require("./page-date.11ty");
const copyrightSnippet = require("./copyright.11ty");
const citeCdaSnippet = require("./cite-cda.11ty");
const mediumSnippet = require("./medium.11ty");
const signatureSnippet = require("./signature.11ty");
const inscriptionsAndLabelsSnippet = require("./inscriptions-and-labels.11ty");
const dimensionsSnippet = require("./dimensions.11ty");
const descriptionSnippet = require("./description.11ty");
const locationSnippet = require("./location.11ty");
const imageDescriptionSnippet = require("./image-description.11ty");
const exhibitonsSnippet = require("./exhibitons.11ty");
const identificationSnippet = require("./identification.11ty");
const provenanceSnippet = require("./provenance.11ty");
const sourcesSnippet = require("./sources.11ty");
const imageStripeSnippet = require("./image-stripe.11ty");
const reportsSnippet = require("./reports.11ty");
const additionalTextInformationSnippet = require("./additional-text-information.11ty");
const referencesSnippet = require("./references.11ty");
const conditionSnippet = require("./condition.11ty");
const masterDataSnippet = require("./graphic-virtual-object-master-data.11ty");

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
const getClientTranslations = (eleventy) => JSON.stringify(eleventy.getClientTranslations());
const getDocumentTitle = ({ content }) => content.metadata.title;
const getMasterData = ({ content }, langCode) => {
  const parentData = content.references.reprints.filter(item => item.kind === "REPRINT_OF");
  const parentObjectId = parentData[0] ? parentData[0].inventoryNumber.replace(config.graphicPrefix, '') : false;
  if (!parentObjectId) return;

  // return masterDataSnippet.getMasterData(eleventy, parentData, langCode); 
  // const masterDataPath = `${langCode}/graphics-master-data-snippets/${parentObjectId}/index.html`;
  // return eleventy.readDocument(masterDataPath);
}

const getNavigation = (eleventy) => {
  const cranachSearchURL = `${config.cranachSearchURL}/${langCode}`;
  return `
    <nav class="main-navigation js-navigation">
      <a class="logo js-home" href="${cranachSearchURL}">cda_</a>
      <a class="back icon has-interaction js-back">arrow_back</a>
      <h2>${eleventy.translate('masterData', langCode)}</h2>
    </nav>
  `;
}

// eslint-disable-next-line func-names
exports.getRealObject = function (eleventy, pageData, langCode) {
  const data = pageData;
  config = eleventy.getConfig();
  eleventy.log(data);
  
  const documentTitle = getDocumentTitle(data);
  const navigation = getNavigation(eleventy);
  const imageStack = getImageStack(data);
  const imageBasePath = getImageBasePath(data);
  const translationsClient = getClientTranslations(eleventy);

  const metaDataHead = metaDataHeader.getHeader(data);
  const dimensions = dimensionsSnippet.getDimensions(eleventy, data, langCode);
  const location = locationSnippet.getLocation(eleventy, data, langCode);
  const signature = signatureSnippet.getSignature(eleventy, data, langCode);
  const inscriptionsAndLabels = inscriptionsAndLabelsSnippet.getInscriptionsAndLabels(eleventy, data, langCode);
  const cdaId = identificationSnippet.getCdaId(eleventy, data, langCode);
  const exhibitions = exhibitonsSnippet.getExhibitions(eleventy, data, langCode);
  const provenance = provenanceSnippet.getProvenance(eleventy, data, langCode);
  const sources = sourcesSnippet.getSources(eleventy, data, langCode, true);
  const imageStripe = imageStripeSnippet.getImageStripe(eleventy, data, langCode, config, true, false);
  const artTechExaminations = reportsSnippet.getReports(eleventy, data, langCode, config, ART_TECH_EXAMINATION);
  const conditionReport = reportsSnippet.getReports(eleventy, data, langCode, config, CONDITION_REPORT);
  const conservationReport = reportsSnippet.getReports(eleventy, data, langCode, config, CONSERVATION_REPORT);
  const additionalTextInformation = additionalTextInformationSnippet.getAdditionalTextInformation(eleventy, data, langCode);
  const relatedInContentTo = referencesSnippet.getReference(eleventy, data, langCode, RELATED_IN_CONTENT_TO);
  const similarTo = referencesSnippet.getReference(eleventy, data, langCode, SIMILAR_TO);
  const belongsTo = referencesSnippet.getReference(eleventy, data, langCode, BELONGS_TO);
  const graphic = referencesSnippet.getReference(eleventy, data, langCode, GRAPHIC);
  const partOfWork = referencesSnippet.getReference(eleventy, data, langCode, PART_OF_WORK, true);
  const imageDescriptionObjectInfo = imageDescriptionSnippet.getImageDescriptionObjectInfo(data);
  const citeCda = citeCdaSnippet.getCiteCDA(eleventy, langCode);
  const improveCdaSnippet = improveCda.getImproveCDA(eleventy, data, config, langCode);
  const copyright = copyrightSnippet.getCopyright();
  const pageDate = pageDateSnippet.getPageDate(eleventy, langCode);
  const condition = conditionSnippet.getCondition(eleventy, data, langCode);
  const medium = mediumSnippet.getMediumOfGraphic(eleventy, data, langCode);
  const shortDescription = descriptionSnippet.getShortDescription(eleventy, data, langCode);
  const masterData = getMasterData(data, langCode);

  return `<!doctype html> 
  <html lang="${langCode}">
    <head>
      <title>cda :: ${eleventy.translate('prints', langCode)} :: ${documentTitle}</title>
      ${metaDataHead}
      <meta name="viewport" content="width=device-width, initial-scale=1, minimum-scale=1.0, maximum-scale=1.0">
      <link href="${eleventy.url('/compiled-assets/main.css')}" rel="stylesheet">
      <link href="${eleventy.url('/assets/images/favicon.svg')}" rel="icon" type="image/svg">
      <script>
        const langCode = "${langCode}";
        const imageStack = ${imageStack};
        const imageBasePath = ${imageBasePath};
        const env = "${eleventy.getENV()}";
        const translations = ${translationsClient};
        const asseturl = "${eleventy.url('/assets')}";
      </script>
    </head>
    <body>
      <div id="page">
        ${navigation}
        ${masterData}
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
            <div class="block">
              ${condition}
              ${medium}
              ${shortDescription}
              ${dimensions}
              ${signature}
              ${inscriptionsAndLabels}
              ${cdaId}
            </div>
            <div class="block">
              ${location}
            </div>
            ${provenance}
            ${exhibitions}
            ${sources}
            ${additionalTextInformation}
            ${partOfWork}

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
      <script src="${eleventy.url('/assets/scripts/main.js')}"></script>
    </body>
  </html>`;
};
