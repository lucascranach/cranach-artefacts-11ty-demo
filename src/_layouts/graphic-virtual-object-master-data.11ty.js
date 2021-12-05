let langCode;
let config;

const metaDataHeader = require("./components/meta-data-head.11ty");
const classificationSnippet = require("./components/classification.11ty");
const titleSnippet = require("./components/title.11ty");
const representantImageSnippet = require("./components/representant-image.11ty");
const attributionSnippet = require("./components/attribution.11ty");
const datingSnippet = require("./components/dating.11ty");
const signatureSnippet = require("./components/signature.11ty");
const dimensionsSnippet = require("./components/dimensions.11ty");
const descriptionSnippet = require("./components/description.11ty");
const exhibitonsSnippet = require("./components/exhibitons.11ty");
const identificationSnippet = require("./components/identification.11ty");
const sourcesSnippet = require("./components/sources.11ty");
const additionalTextInformationSnippet = require("./components/additional-text-information.11ty");

const getLangCode = ({ content }) => content.metadata.langCode;

const getHeader = (data) => {
  const title = titleSnippet.getTitle(this, data, langCode);
  const subtitle = classificationSnippet.getClassification(this, data, langCode);
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
exports.render = function (pageData) {
  const data = pageData;
  langCode = getLangCode(data);
  config = this.getConfig();

  data.content.currentCollection = data.collections[data.collectionID];
  data.content.entityType = data.entityType;
  data.content.url = `${this.getBaseUrl()}${data.page.url}`;

  this.log(data);
  
  const header = getHeader(data);
  const attribution = attributionSnippet.getAttribution(this, data, langCode);
  const dating = datingSnippet.getDating(this, data, langCode);
  const copy = descriptionSnippet.getCopyText(this, data, langCode);
  const image = representantImageSnippet.getRepresentant(this, data);
  const dimensions = dimensionsSnippet.getDimensions(this, data, langCode);
  const signature = signatureSnippet.getSignature(this, data, langCode);
  const ids = identificationSnippet.getIdsGraphics(this, data, langCode);
  const exhibitions = exhibitonsSnippet.getExhibitions(this, data, langCode);
  const additionalTextInformation = additionalTextInformationSnippet.getAdditionalTextInformation(this, data, langCode);
  const sources = sourcesSnippet.getSources(this, data, langCode, true);

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
