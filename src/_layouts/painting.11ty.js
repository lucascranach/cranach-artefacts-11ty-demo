const getHeader = require('../_components/header');
  
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

const getTexts = ({ content }) => {
  const langCode = content.metadata.langCode;
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
      </dl>

      <dl class="definition-list">
        <dt class="definition-list__term">${this.translate("productionDate", langCode)}</dt>
        ${content.dating.dated} ${content.dating.remarks}
        ${historicDates}
      </dl>

      <dl class="definition-list">
        <dt class="definition-list__term">${this.translate("dimensions", langCode)}</dt>
        ${content.dimensions}
      </dl>

      <dl class="definition-list">
        <dt class="definition-list__term">${this.translate("signature", langCode)}</dt>
        ${content.signature}
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

const getLocation = ({ content }) => {
  const langCode = content.metadata.langCode;
  return `
    <div class="block">

      <dl class="definition-list">
        <dt class="definition-list__term">${this.translate("owner", langCode)}</dt>
        ${content.owner}
      </dl>

      <dl class="definition-list">
        <dt class="definition-list__term">${this.translate("repository", langCode)}</dt>
        ${content.repository}
      </dl>

      <dl class="definition-list">
        <dt class="definition-list__term">${this.translate("location", langCode)}</dt>
        ${content.locations[0].term}
      </dl>

    </div>
  `;
}

exports.render = function (data) {
  const langCode = data.content.metadata.langCode;
  const header = getHeader(data);
  const title = getTitle(data);
  const image = getImage(data);
  const copy = getCopyText(data);
  const texts = getTexts(data);
  const location = getLocation(data);
  
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
        </div>
      </section>
    </body>
    <script src="${this.url('/assets/scripts/main.js')}"></script>
  </html>`;
};
