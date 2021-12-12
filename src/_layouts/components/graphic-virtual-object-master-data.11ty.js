let langCode;
let config;

const classificationSnippet = require("./classification.11ty");
const titleSnippet = require("./title.11ty");
const representantImageSnippet = require("./representant-image.11ty");
const attributionSnippet = require("./attribution.11ty");
const datingSnippet = require("./dating.11ty");
const signatureSnippet = require("./signature.11ty");
const dimensionsSnippet = require("./dimensions.11ty");
const descriptionSnippet = require("./description.11ty");
const exhibitonsSnippet = require("./exhibitons.11ty");
const identificationSnippet = require("./identification.11ty");
const sourcesSnippet = require("./sources.11ty");
const additionalTextInformationSnippet = require("./additional-text-information.11ty");

const getLangCode = ({ content }) => content.metadata.langCode;

const getHeader = (eleventy, data, langCode) => {
  const title = titleSnippet.getTitle(eleventy, data, langCode);
  const subtitle = classificationSnippet.getClassification(eleventy, data, langCode);
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

// eslint-disable-next-line func-names
exports.getMasterData = (eleventy, pageData) => {
  const data = pageData;
  langCode = getLangCode(data);
  config = eleventy.getConfig();

  data.content.currentCollection = data.collections[data.collectionID];
  data.content.entityType = data.entityType;
  data.content.url = `${eleventy.getBaseUrl()}${data.page.url}`;

  eleventy.log(data);
  
  const header = getHeader(eleventy, data, langCode);
  const attribution = attributionSnippet.getAttribution(eleventy, data, langCode);
  const dating = datingSnippet.getDating(eleventy, data, langCode);
  const copy = descriptionSnippet.getCopyText(eleventy, data, langCode);
  const image = representantImageSnippet.getRepresentant(eleventy, data);
  const dimensions = dimensionsSnippet.getDimensions(eleventy, data, langCode);
  const signature = signatureSnippet.getSignature(eleventy, data, langCode);
  const ids = identificationSnippet.getIdsGraphics(eleventy, data, langCode);
  const exhibitions = exhibitonsSnippet.getExhibitions(eleventy, data, langCode);
  const additionalTextInformation = additionalTextInformationSnippet.getAdditionalTextInformation(eleventy, data, langCode);
  const sources = sourcesSnippet.getSources(eleventy, data, langCode, true);

  return `
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
            </div>
            <div class="block">
              ${ids}
            </div>
          </div>
          <div class="marginal-content">
            ${exhibitions}
            ${sources}
            ${additionalTextInformation}
          </div>
        </div>
      </div>
    </section>
  `;
};
