const getHeader = require('../_components/header');

let langCode;

const getLangCode = ({ content }) => {
  return content.metadata.langCode;
}

const getTitle = ({ content }) => {
  return content.metadata.title;
}

const getImage = ({ content }) => {
  const src = content.metadata.imgSrc;
  const alt = content.metadata.title;
  return `
    <figure class="leporello-recog__image">
      <img src="${src}" alt="${alt}">
    </figure>
  `;
}

const getTextBlock = ({ content }) => {
  const attribution = content.involvedPersons.map(
    (item) => {
      const remarks = item.remarks ? `<span className="remarks">${item.remarks}</span>` : '';
      return `
        <dd class="definition-list__definition">
          ${item.alternativeName}, ${item.role}${remarks}
        </dd>
      `;
    }
  );
  
  const historicDates = content.dating.historicEventInformations.map(date => {
    return `<dd class="definition-list__definition">${date.text} ${date.remarks}</dd>`;
  });

  
  return `
    <div class="block">
      <dl class="definition-list">
        
        <dt class="definition-list__term">${this.translate("attribution", langCode)}</dt>
        ${attribution}

        <dt class="definition-list__term">${this.translate("productionDate", langCode)}</dt>
        <dd class="definition-list__definition">${content.dating.dated} ${content.dating.remarks}</dd>
        ${historicDates}

        <dt class="definition-list__term">${this.translate("dimensions", langCode)}</dt>
        <dd class="definition-list__definition">${content.dimensions}</dd>

        <dt class="definition-list__term">${this.translate("signature", langCode)}</dt>
        <dd class="definition-list__definition">${content.signature}</dd>
      </dl>
    </div>
  `;
}

const getCopyText = ({ content }) => {
  const description = content.description ? `<p>${this.markdownify(content.description)}</p>` : '';
  return `
    ${description}
  `;
}

const getLocationBlock = ({ content }) => {

  return `
    <div class="block">

      <dl class="definition-list">
        <dt class="definition-list__term">${this.translate("owner", langCode)}</dt>
        ${content.owner}

        <dt class="definition-list__term">${this.translate("repository", langCode)}</dt>
        ${content.repository}

        <dt class="definition-list__term">${this.translate("location", langCode)}</dt>
        ${content.locations[0].term}
      </dl>

    </div>
  `;
}

const getInscriptionBlock = ({ content }) => {
  const inscription = content.inscription || content.markings ? `
  <dt class="definition-list__term">${this.translate("inscriptions", langCode)}</dt>
  <dd class="definition-list__definition">${content.inscription}${content.markings}</dd>` : '';
  
  return `
    <div class="block">

      <dl class="definition-list">
        ${inscription}

        <dt class="definition-list__term">CDA ID</dt>
        ${content.metadata.id}
      
        <dt class="definition-list__term">${this.translate("permalink", langCode)}</dt>
        ${content.url}
      </dl>

    </div>
  `;
}

exports.render = function (data) {
  langCode = getLangCode(data);
  data.content.url = `${this.getBaseUrl()}${data.page.url}`;
  
  const header = getHeader(data);
  const title = getTitle(data);
  const image = getImage(data);
  const copy = getCopyText(data);
  const texts = getTextBlock(data);
  const location = getLocationBlock(data);
  const inscription = getInscriptionBlock(data);
  
  return `
  <!doctype html>
  <html lang="de">
    <head>
      <title>cda // ${this.translate("paintings", langCode)} // ${title}</title>
      ${this.meta()}
      <link href="${this.url('/assets/main.css')}" rel="stylesheet">
      <link href="${this.url('/assets/images/favicon.svg')}" rel="icon" type="image/svg">
    </head>
    <body>
      <section class="leporello-recog">
        ${image}
        <div class="leporello-recog__text">
          ${header}
          <div class="copytext">
            ${copy}
          </div>
          <div class="block">
            ${texts}
          </div>
          <div class="block">
            ${location}
          </div>
          <div class="block">
            ${inscription}
          </div>
          
        </div>
      </section>
    </body>
    <script src="${this.url('/assets/scripts/main.js')}"></script>
  </html>`;
};
