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
   // console.log(date);
  });
  
  return `
    <div class="foldable-block">
      <h2 class="foldable-block__headline">Texte</h2>
      <dl class="definition-list">
        <dt class="definition-list__term">${this.translate("attribution", langCode)}</dt>
        ${attribution}
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

exports.render = function (data) {
  const header = getHeader(data);
  const title = getTitle(data);
  const image = getImage(data);
  const copy = getCopyText(data);
  const texts = getTexts(data);
  
  return `
  <!doctype html>
  <html lang="de">
    <head>
      <title>cda // ${title}</title>
      ${this.meta()}
      <link href="${this.url('/assets/main.css')}" rel="stylesheet">
      <link href="${this.url('/assets/images/favicon.svg')}" rel="icon" type="image/svg">
    </head>
    <body>
      <section class="leporello-recog">
        ${image}
        <div class="leporello-recog__text">
          ${header}
          <div class="">
          ${copy}
          </div>
          ${texts}
        </div>
      </section>
    </body>
    <script src="${this.url('/assets/scripts/main.js')}"></script>
  </html>`;
};
