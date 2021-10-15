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
      <img src="${src}" alt="${this.altText(alt)}">
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
  const description = content.description ? `${this.markdownify(content.description)}` : '';
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
        <dd class="definition-list__definition">${content.metadata.id}</dd>

        <dt class="definition-list__term">${this.translate("objectName", langCode)}</dt>
        <dd class="definition-list__definition">${content.objectName}</dd>
      
        <dt class="definition-list__term">${this.translate("permalink", langCode)}</dt>
        <dd class="definition-list__definition">${content.url}</dd>
      </dl>

    </div>
  `;
}

const getSourcesBlock = ({ content }) => {
  const provenance = !content.provenance ? '' : `
    <div class="block">
      <h3 class="is-medium">${this.translate("provenance", langCode)}</h3>
      ${this.markdownify(content.provenance)}
    </div>`;
  
  const exhibitions = !content.exhibitionHistory ? '' : `
    <div class="block"> 
      <h3 class="is-medium">${this.translate("exhibitions", langCode)}</h3>
      ${this.markdownify(content.exhibitionHistory)}
    </div>`;
  
  const publicationList = content.publications.map(
    (item) => {
      const literatureReference = this.getLiteratureReference(item.referenceId, langCode);
      const literatureReferenceTableData = this.getLiteratureReferenceTableData(literatureReference, content.metadata.id);
      return `
        <tr class="row">
          <td class="cell">${item.title}</td>
          <td class="cell">${item.pageNumber}</td>
          <td class="cell">${literatureReferenceTableData.catalogNumber}</td>
          <td class="cell">${literatureReferenceTableData.figureNumber}</td>
        </tr>`;
    }
  );
  
  const publications = content.publications ? `
    <div class="block"> 
      <h3 class="is-medium">${this.translate("literature", langCode)}</h3>
      <div class="dynamic-table">
        <table class="table">
          <thead class="head">
            <tr class="row">
              <td class="cell" style="width: 40%"></td>
              <td class="cell" style="width: 20%">${this.translate("referenceOnPage", langCode)}</td>
              <td class="cell" style="width: 20%">${this.translate("catalogueNumber", langCode)}</td>
              <td class="cell" style="width: 20%">${this.translate("plate", langCode)}</td>
            </tr>
          </thead>
          <tbody class="body">
          ${publicationList.join("\n")}
          </tbody>
        </table>
      </div>
    </div>` : '';
  
  return `
    ${provenance}
    ${exhibitions}
    ${publications}
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
  const sources = getSourcesBlock(data);
  
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

          ${sources}
          
        </div>
      </section>
    </body>
    <script src="${this.url('/assets/scripts/main.js')}"></script>
  </html>`;
};
