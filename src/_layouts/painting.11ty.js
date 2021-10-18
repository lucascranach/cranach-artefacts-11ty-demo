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
  
  
  const getLiteraturDetails = (item) => {
    const author = item && item.persons ? item.persons.filter(person => person.role === "AUTHOR").map(person => person.name) : [];
    const publisher = item && item.persons ? item.persons.filter(person => person.role === "PUBLISHER").map(person => person.name) : [];
    const editor = item && item.persons ? item.persons.filter(person => person.role === "EDITORIAL_STAFF").map(person => person.name) : [];
    const alternateNumbers = (!item || !item.alternateNumbers) ? [] : item.alternateNumbers.map(alternateNumber => {
      return `
        ${alternateNumber.dewscription}
        ${alternateNumber.number}
      `;
    });

    const getRow = (content, translationID) => {
      return !content ? '' : `<tr><th>${this.translate(translationID, langCode)}</th><td>${this.stripTags(content)}</td></tr>`;
    };

    return `
      <table class="literature-item-details-table">
        ${getRow(author.join(", "), "author")}
        ${getRow(publisher.join(", "), "publisher")}
        ${getRow(editor.join(", "), "publisher")}
        ${item && item.title ? getRow(item.title, "title") : ''}
        ${item && item.pages ? getRow(item.pages, "pages") : ''}
        ${item && item.series ? getRow(item.series, "series") : ''}
        ${item && item.volume ? getRow(item.volume, "volume") : ''}
        ${item && item.journal ? getRow(item.journal, "journal") : ''}
        ${item && item.issue ? getRow(item.issue, "issue") : ''}
        ${item && item.publication ? getRow(item.publication, "publication") : ''}
        ${item && item.publishDate ? getRow(item.publishDate, "publishDate") : ''}
        ${item && item.publishLocation ? getRow(item.publishLocation, "publishLocation") : ''}
        ${item && item.periodOfOrigin ? getRow(item.periodOfOrigin, "periodOfOrigin") : ''}
        ${item && item.physicalDescription ? getRow(item.physicalDescription, "physicalDescription") : ''}
        ${item && item.mention ? getRow(item.mention, "mention") : ''}
        ${item && item.link ? getRow(item.link, "permalink") : ''}
        ${getRow(alternateNumbers.join(", "), "alternativeNumbers")}
      </table>
    `;
  };

  const publicationList = content.publications.map(
    (item, index) => {
      const literatureReference = this.getLiteratureReference(item.referenceId, langCode);
      const literatureReferenceTableData = this.getLiteratureReferenceTableData(literatureReference, content.metadata.id);
      const hasBackground = index % 2 ? "has-bg" : '';
      return `
        <tr
          class="row ${hasBackground} is-head" 
          id="litRef${item.referenceId}">

          <td class="cell has-interaction"><a href="#" data-js-toggle-literature="${item.referenceId}">${item.title}</a></td>
          <td class="cell">${item.pageNumber}</td>
          <td class="cell">${literatureReferenceTableData.catalogNumber}</td>
          <td class="cell">${literatureReferenceTableData.figureNumber}</td>
        </tr>
        <tr class="row ${hasBackground} is-detail" id="litRefData${item.referenceId}">
          <td class="cell" colspan="4">
            ${getLiteraturDetails(literatureReference)}
          </td>
        </tr>
        `;
    }
  );

  const publications = content.publications ? `
    <div class="block"> 
      <h3 class="is-medium">${this.translate("literature", langCode)}</h3>
      <table class="table literature">
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
    </div>` : '';
  
  return `
    ${provenance}
    ${exhibitions}
    ${publications}
  `;
}

const getImageStack = ({ content }) => {
  return JSON.stringify(content.images);
}

const getImageBasePath = () => {
  const config = this.getConfig();
  return JSON.stringify(config['imageTiles']);
}

const getTranslations = () => {
  return JSON.stringify(this.getTranslations());
}

const getImageStripe = ({ content }) => {
  const config = this.getConfig();
  const imageStack = content.images;
  const imageTypes = config['imageTypes'];
  const imageStripe = [];
  
  for (const [key, value] of Object.entries(imageTypes)) {
    if (imageStack && imageStack[key]) {
      const images = imageStack[key].images;
      const html = images.map((image, index) => {
        const title = image.metadata && image.metadata[langCode] ? this.altText(image.metadata[langCode].description) : `${key}`;
        return `
          <li
            class="image-stripe-list__item has-interaction"
            data-image-type="${key}" 
            data-image-index="${index}"
            data-js-change-image='{"key":"${key}","index":${index}}'>
            <img src="${image.sizes.xsmall.src}" alt="${title}">
          </li>
        `;
      });
    
      imageStripe.push(html.join(""));
    }
  }

  return `
    <ul class="image-stripe-list">
      ${imageStripe.join("")}
    </ul>
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
  const imageStack = getImageStack(data);
  const imageBasePath = getImageBasePath(data);
  const translations = getTranslations(data);
  const imageStripe = getImageStripe(data);
  
  return `
  <!doctype html>
  <html lang="de">
    <head>
      <title>cda // ${this.translate("paintings", langCode)} // ${title}</title>
      ${this.meta()}
      <link href="${this.url('/assets/main.css')}" rel="stylesheet">
      <link href="${this.url('/assets/images/favicon.svg')}" rel="icon" type="image/svg">
      <script>
      const langCode = "${langCode}";
      const imageStack = ${imageStack};
      const imageBasePath = ${imageBasePath};
      const env = "${this.getENV()}";
      const translations = ${translations};
      </script>
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

      <section class="leporello-explore">

        <figure class="main-image">
          <div class="image-viewer">
            <div id="viewer-content" class="image-viewer__content"></div>
          </div>
          <figcaption id="image-caption"></figcaption>
        </figure>

        <div class="expore-content">
          ${imageStripe}
        </div>

      </section>
    </body>
    <script src="https://cdn.jsdelivr.net/npm/openseadragon@2.4.2/build/openseadragon/openseadragon.min.js"></script>
    <script src="${this.url('/assets/scripts/main.js')}"></script>
  </html>`;
};
