let langCode;
let config;

const getLangCode = ({ content }) => {
  return content.metadata.langCode;
}

const getDocumentTitle = ({ content }) => {
  return content.metadata.title;
}

const getTitle = (content) => {
  const titleList = content.titles.map(item => { return {"text": item.title, "remark": item.remark }});
  const allTitles = this.getRemarkDataTable("Titles", titleList, "mainTitle");
  return `
    <h1 id="mainTitle" class="title">${content.metadata.title}</h1>
    ${allTitles}
  `; ;
}

const getMedium = (content) => {
  const [text, remark] = content.medium.split(/\n/);
  const medium = [{"text": text, "remark": remark}];
  const mediumTable = this.getRemarkDataTable("Medium", medium, "subtitle");
  
  return !content.medium ? '' : `
    <p id="subtitle" class="subtitle">${medium[0].text}</p>
    ${mediumTable}
  `;
}

const getImage = ({ content }) => {
  const src = content.metadata.imgSrc;
  const alt = content.metadata.title;
  return `
    <figure class="leporello-recog__image">
      <img loading="lazy" src="${src}" alt="${this.altText(alt)}">
    </figure>
  `;
}

const getHeader = ({ content }) => {
  const title = getTitle(content);
  const subtitle = getMedium(content);
  return `
  <header class="artefact-header">
    ${title}
    ${subtitle}
  </header>`;
}

const getAttribution = ({ content }) => {
  const numberOfItems = 1;
  const attributionShortListItems = content.involvedPersons.slice(0, numberOfItems);
  const attributionShortList = attributionShortListItems.map((item) => {
    const name = item.name ? `${item.name} ` : '';
    const prefix = item.prefix ? `${item.prefix} ` : '';
    const suffix = item.suffix ? `${item.suffix} ` : '';
    return `
        <dd id="attributionData" class="definition-list__definition">
        ${prefix}${name}${suffix}
        </dd>
      `;
    }
  );
  const attributionFullList = content.involvedPersons.map(item => {
    return { "text": `${item.prefix}${item.name}${item.suffix}`, "remark": item.remarks }
  });
  const allAttributions = this.getRemarkDataTable("Attributions", attributionFullList, "attributionData");
  return `
    <dl class="definition-list">
      <dt class="definition-list__term">${this.translate("attribution", langCode)}</dt>
      ${attributionShortList.join("")}
    </dl>
    ${allAttributions}
  `;
}

const getDating= ({ content }) => {

  const datesFullList = content.dating.historicEventInformations.map(item => {
    return { "text": `${item.text}`, "remark": item.remarks }
  });
  const allDates = this.getRemarkDataTable("Dates", datesFullList, "dataList");

  return `
    <dl class="definition-list">
      <dt class="definition-list__term">${this.translate("productionDate", langCode)}</dt>
      <dd id="dataList" class="definition-list__definition">${content.dating.dated}</dd>
    </dl>

    ${allDates}
  `;
}

const getSignature = ({ content }) => {
  const signatureItems = content.signature.split(/\]\n\n/).map(item => {
    const seperator = item.match(/\n\n/) ? '\n\n' : '\n';
    const elements = item.split(seperator);
    return {"text": elements.shift(), "remark": elements.join("\n")}
  });
  const signatureTable = signatureItems[0].text.match(/^keine$/i) ? '' : this.getRemarkDataTable("Signature", signatureItems, "signature");
  return !content.signature ? '' : `
    <dl class="definition-list">
      <dt class="definition-list__term">${this.translate("signature", langCode)}</dt>
      <dd id="signature" class="definition-list__definition">${signatureItems[0].text}</dd>
    </dl>
    ${signatureTable}
  `;
}

const getInscriptions = ({ content }) => {
  let inscriptionsRaw = `${content.inscription}${content.markings}`.replace(/\:\n/, ": ");
  inscriptionsRaw = inscriptionsRaw.replace(/\n *?\n/sg, "\n\n");

  const inscriptionItems = inscriptionsRaw.split(/\]\n\n/).map(item => {
    const seperator = item.match(/\n\n/) ? '\n\n' : '\n';
    const elements = item.split(seperator);
    return {"text": elements.shift(), "remark": elements.join("\n")}
  });
  
  const inscriptionTable = inscriptionItems[0].text.match(/^keine$/i) ? '' : this.getRemarkDataTable("Inscriptions", inscriptionItems, "inscriptions");
  return !inscriptionsRaw ? '' : `
    <dl class="definition-list">
      <dt class="definition-list__term">${this.translate("inscriptions", langCode)}</dt>
      <dd id="inscriptions" class="definition-list__definition">${inscriptionItems[0].text}</dd>
    </dl>
    ${inscriptionTable}
  `;
}

const getDimensions = ({ content }) => {
  content.dimensions.match(/(.*?)\n|;/);
  const visibleContent = RegExp.$1.replace(/Maße/, "");
  const [text, remark] = content.dimensions.split(/\[/);
  const dimensions = [{ "text": text, "remark": `[${remark}` }];
  const dimensionsTable = this.getRemarkDataTable("Dimensions", dimensions, "dimensions");
  
  return `
    <dl class="definition-list">
      <dt class="definition-list__term">${this.translate("dimensions", langCode)}</dt>
      <dd id="dimensions" class="definition-list__definition">${visibleContent}</dd>
    </dl>
    ${dimensionsTable}
  `;
}

const getCopyText = ({ content }) => {
  const numberOfWords = 30;
  const [fulltext, author] = content.description.split(/\[/);
  const words = fulltext.split(/ /);
  const preview = words.slice(0, numberOfWords).join(" ");
  const text = words.length > numberOfWords ? `
    <div id="switchableCopyText" data-js-switchable-content='["previewText","fullText"]'>
      <div id="previewText" class="preview-text">${this.markdownify(preview)}</div>
      <div class="is-cut full-text" id="fullText">${this.markdownify(fulltext)}<p class="remark">[${author}</p></div>
    </div>
    `: `
      ${this.markdownify(fulltext)}<p class="remark">[${author}</p>
    `;
  return text;
}

const getLocation = ({ content }) => {

  return `
    <dl class="definition-list">
      <dt class="definition-list__term">${this.translate("owner", langCode)}</dt>
      <dd class="definition-list__definition">${content.owner}</dd>
      <dt class="definition-list__term">${this.translate("repository", langCode)}</dt>
      <dd class="definition-list__definition">${content.repository}</dd>
      <dt class="definition-list__term">${this.translate("location", langCode)}</dt>
      <dd class="definition-list__definition">${content.locations[0].term}</dd>
    </dl>
  `;
}


const getIds = ({ content }) => {
  return `
    <dl class="definition-list">
      <dt class="definition-list__term">CDA ID</dt>
      <dd class="definition-list__definition">${content.metadata.id}</dd>
      <dt class="definition-list__term">${this.translate("objectName", langCode)}</dt>
      <dd class="definition-list__definition">${content.objectName}</dd>
      <dt class="definition-list__term">${this.translate("permalink", langCode)}</dt>
      <dd class="definition-list__definition">${content.url}</dd>
    </dl>
  `;
}

const getExhibitions = ({ content }) => {
  return !content.exhibitionHistory ? '' : `
    <div class="foldable-block has-strong-separator"> 
      <h2 class="foldable-block__headline is-expand-trigger" data-js-expanded="false" data-js-expandable="exhibition-history">${this.translate("exhibitions", langCode)}</h2>
      <div class="expandable-content" id="exhibition-history">
      ${this.markdownify(content.exhibitionHistory)}
      </div>
    </div>`;
};

const getProvenance = ({ content }) => {
  return !content.provenance ? '' : `
    <div class="foldable-block has-strong-separator">
      <h2 class="foldable-block__headline is-expand-trigger" data-js-expanded="false" data-js-expandable="provenance">${this.translate("provenance", langCode)}</h2>
      <div class="expandable-content" id="provenance">
      ${this.markdownify(content.provenance)}
      </div>
    </div>
  `;
}

const getSources = ({ content }) => {

  const getLiteraturDetails = (item) => {
    const author = item && item.persons ? item.persons.filter(person => person.role === "AUTHOR").map(person => person.name) : [];
    const publisher = item && item.persons ? item.persons.filter(person => person.role === "PUBLISHER").map(person => person.name) : [];
    const editor = item && item.persons ? item.persons.filter(person => person.role === "EDITORIAL_STAFF").map(person => person.name) : [];
    const alternateNumbers = (!item || !item.alternateNumbers) ? [] : item.alternateNumbers.map(alternateNumber => {
      return `
        ${alternateNumber.description}
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
          id="litRef${item.referenceId}-${index}">

          <td class="cell has-interaction"><a href="#" data-js-toggle-literature="${item.referenceId}-${index}">${item.title}</a></td>
          <td class="cell">${item.pageNumber}</td>
          <td class="cell">${literatureReferenceTableData.catalogNumber}</td>
          <td class="cell">${literatureReferenceTableData.figureNumber}</td>
        </tr>
        <tr class="row ${hasBackground} is-detail" id="litRefData${item.referenceId}-${index}">
          <td class="cell" colspan="4">
            ${getLiteraturDetails(literatureReference)}
          </td>
        </tr>
        `;
    }
  );

  const publications = content.publications ? `
    <div class="foldable-block has-strong-separator"> 
      <h2 class="foldable-block__headline is-expand-trigger" data-js-expanded="false" data-js-expandable="literature-list">${this.translate("literature", langCode)}</h2>
      <div id="literature-list" class="expandable-content">
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
      </div>
    </div>` : '';

  return publications;
}

const getImageStack = ({ content }) => {
  return JSON.stringify(content.images);
}

const getImageBasePath = () => {
  return JSON.stringify(config['imageTiles']);
}

const getClientTranslations = () => {
  return JSON.stringify(this.getClientTranslations());
}

const getImageStripe = ({ content }) => {
  const imageStack = content.images;
  const imageTypes = config['imageTypes'];


  const imageStripe = Object.keys(imageTypes).map(key => {

    if (!imageStack || !imageStack[key]) return;

    const images = imageStack[key].images;
    const html = images.map(image => {

      const title = image.metadata && image.metadata[langCode] ? this.altText(image.metadata[langCode].description) : `${key}`;
      return `
        <li
          class="image-stripe-list__item has-interaction"
          data-image-type="${key}" 
          data-image-id="${image.id}"
          data-js-change-image='{"key":"${key}","id":"${image.id}"}'>
          <img loading="lazy" src="${image.sizes.xsmall.src}" alt="${title}">
        </li>
      `;
    });
    return (html.join(""));

  });

  const availableImageTypes = Object.keys(imageTypes).map(key => {
    if (!imageStack || !imageStack[key]) return;
    const numberOfImages = imageStack[key].images.length;
    const type = (numberOfImages === 0) ? '' : `<option value="${key}">${this.translate(key, langCode)} (${numberOfImages})</option>`;
    return type;
  });

  const imageTypeSelector = `
    <div class="imagetype-selector">
      <select size="1" data-js-image-selector="true">
        <option value="all">${this.translate('all', langCode)}</option>
        ${availableImageTypes.join("")}
      </select>
    </div>
  `;

  return `
    <div class="foldable-block is-sticky">
      <h2 class="foldable-block__headline is-expand-trigger" data-js-expanded="true" data-js-expandable="image-stripe">${this.translate("illustrations", langCode)}</h2>
      <div id="image-stripe" class="expandable-content image-stripe">
        ${imageTypeSelector}
        <ul class="image-stripe-list">
          ${imageStripe.join("")}
        </ul>
      </div>
    </div>
  `;
}

const ART_TECH_EXAMINATION = 'ArtTechExamination';
const CONDITION_REPORT = 'ConditionReport';
const CONSERVATION_REPORT = 'ConservationReport';

const getReports = ({ content }, type) => {
  console.log(`- Report Type:${type}`);
  const reports = content.restorationSurveys.filter((rs) => rs.type === type);
  const reportList = reports.reverse().map((report, index) => {

    const imageStripeItems = report.fileReferences.map((file) => {
      const type = file.type;
      const id = file.id;

      if (!content.images || !content.images[type]) return;
      const image = content.images[type].images.filter(image => image.id === id).shift();
      if (!image) return;

      return `
      <li
        class="image-stripe-list__item has-interaction"
        data-image-type="${type}" 
        data-image-id="${id}"
        data-js-change-image='{"key":"${type}","id":"${id}"}'>
        <img loading="lazy" src="${image.sizes.xsmall.src}" alt="${type}">
      </li>
      `;
    });
    const imageStripeReport = imageStripeItems.length > 0 ? `<ul class="image-stripe-list">${imageStripeItems.join("")}</ul>` : '';
    const involvedPersonList = report.involvedPersons.map(person => {
      return `<li>${person.role} ${person.name}</li>`;
    })
    const involvedPersons = involvedPersonList.length === 0 ? '' : `
      <ul class="survey-persons">
        ${involvedPersonList.join("")}
      </ul>`;
    const firstItem = report.tests && report.tests.length > 0 ? report.tests[0] : false;
    const surveyTitle = firstItem.purpose;
    const surveyKeywordList = !firstItem ? [] : firstItem.keywords.map(keyword => {
      return `<li>${keyword.name}</li>`;
    });
    const surveyKeywords = surveyKeywordList.length > 0 ? `<ul class="survey-keywords">${surveyKeywordList.join("")}</ul>` : '';
    const surveyContent = report.tests.sort((a, b) => { return a.order - b.order }).map(test => {
      const order = `${test.order.toString().substr(0, 1)}.${test.order.toString().substr(1, 3)}`;

      const text = this.markdownify(test.text.replace(/\n/g, "\n"));
      return `
        <h4 class="survey-kind">${order} ${test.kind}</h4>
        ${text}
      `;
    });

    const project = report.project ? this.markdownify(report.project.replace(/\n/g, "\n\n")) : '';
    const overallAnalysis = report.overallAnalysis ? this.markdownify(report.overallAnalysis.replace(/\n/g, "\n\n")) : '';
    const remarks = report.remarks ? this.markdownify(report.remarks.replace(/\n/g, "\n\n")) : '';
    const getDate = () => {
      const processingDates = report.processingDates;
      return processingDates.beginDate !== processingDates.endDate ? `${processingDates.beginDate} - ${processingDates.endDate}` : processingDates.beginDate;
    }
    const date = report.processingDates ? getDate() : false;
    const surveySlug = this.slugify(`${surveyTitle}-${index}-${type}`);
    const getTitle = () => {
      if (surveyTitle && date) return `<h3 class="survey-title"><span class="is-identifier">${date}</span>${surveyTitle}</h3>`;
      if (date) return `<h3 class="survey-title"><span class="is-identifier">${this.translate("date", langCode)}</span>${date}</h3>`;
      return '';
    }
    const title = getTitle();

    return `
    <div class="survey foldable-block has-separator">
      <header class="survey-header is-expand-trigger" data-js-expanded="false" data-js-expandable="${surveySlug}">
        ${title}
        ${surveyKeywords}
        ${imageStripeReport}
      </header>

      <div class="survey-content expandable-content" id="${surveySlug}">
        ${surveyContent.join("")}
        ${project}
        ${overallAnalysis}
        ${remarks}
        ${involvedPersons}
      </div>
    </div>
    `;
  });


  return (reports && reports.length > 0) ?
    `
    <div class="foldable-block has-strong-separator">
      <h2 class="foldable-block__headline is-expand-trigger" data-js-expanded="false" data-js-expandable="report-${type}">${this.translate(type, langCode)}</h2>
      <div id="report-${type}" class="expandable-content">
        ${reportList.join("")}
      </div>
    </div>
    ` : '';
}

const getAdditionalTextInformation = ({ content }) => {
  const additionalInfos = content.additionalTextInformation;
  const additionalInfoTypes = additionalInfos.map(item => item.type);
  const uniqueAdditionalInfoTypes = additionalInfoTypes.filter((item, index) => additionalInfoTypes.indexOf(item) === index);
  const getTypeContent = (type) => {
    const typeContent = additionalInfos.filter(item => item.type === type);
    return typeContent.length === 0 ? '' : typeContent.map(item => `
      <div class="block has-padding">
        ${this.markdownify(item.text)}
      </div>
    `);
  }
  return uniqueAdditionalInfoTypes.length === 0 ? '' : uniqueAdditionalInfoTypes.map(type => {
    return `
    <div class="foldable-block has-strong-separator">
        <h2 class="foldable-block__headline is-expand-trigger" data-js-expanded="false" data-js-expandable="${this.slugify(type)}">${type}</h2>
        <div class="expandable-content" id="${this.slugify(type)}">
          ${getTypeContent(type).join("")}
        </div>
      </div>
    `;
  })
}

const RELATED_IN_CONTENT_TO = 'RELATED_IN_CONTENT_TO';
const SIMILAR_TO = 'SIMILAR_TO';
const BELONGS_TO = 'BELONGS_TO';
const GRAPHIC = 'GRAPHIC';
const PART_OF_WORK = 'PART_OF_WORK';

const getReference = ({ content }, type, isOpen = false) => {
  const references = content.references.concat(content.secondaryReferences);
  const getTypeContent = (type) => {
    const typeContentItems = references.filter(item => item.kind === type);
    const typeContentItemList = typeContentItems.map(item => {
      const refObjectMeta = this.getReferenceObjectMeta(content.currentCollection, item.inventoryNumber);
      const refObjectLink = `/${langCode}/${this.page.fileSlug}/${refObjectMeta.id}/`;
      return `
        <div class="related-item-wrap">
          <a href="${refObjectLink}">
          <figure class="related-item">
            <div class="related-item__image">
              <img loading="lazy" src="${refObjectMeta.imgSrc}" alt="${this.altText(refObjectMeta.title)}">
            </div>
            <figcaption class="related-item__caption">
              <ul>
                <li class="related-item__title">${refObjectMeta.title}</li>
                <li class="related-item__id">${refObjectMeta.id}</li>
                <li class="related-item__text">${refObjectMeta.owner}</li></ul>
            </figcaption>
          </figure>
          </a>
        </div>
      `;
    });


    const state = isOpen ? 'true' : 'false';

    return typeContentItems.length === 0 ? '' : `
      <div class="foldable-block has-strong-separator">
        <h2 class="foldable-block__headline is-expand-trigger" data-js-expanded="${state}" data-js-expandable="${this.slugify(type)}">${this.translate(type, langCode)}</h2>
        <div class="expandable-content" id="${this.slugify(type)}">
        ${typeContentItemList.join("")}
        </div>
      </div>
    `;
  }

  return getTypeContent(type);
}

exports.render = function (data) {
  langCode = getLangCode(data);
  config = this.getConfig();
  data.content.currentCollection = data.collections[data.collectionID];
  data.content.url = `${this.getBaseUrl()}${data.page.url}`;

  this.log(data);
  const documentTitle = getDocumentTitle(data);
  const header = getHeader(data);
  const image = getImage(data);
  const copy = getCopyText(data);
  const dating = getDating(data);
  const dimensions = getDimensions(data);
  const attribution = getAttribution(data);
  const location = getLocation(data);
  const signature  = getSignature(data);
  const inscription = getInscriptions(data);
  const ids = getIds(data);
  const exhibitions = getExhibitions(data);
  const provenance = getProvenance(data);
  const sources = getSources(data);
  const imageStack = getImageStack(data);
  const imageBasePath = getImageBasePath(data);
  const translationsClient = getClientTranslations(data);
  const imageStripe = getImageStripe(data);
  const artTechExaminations = getReports(data, ART_TECH_EXAMINATION);
  const conditionReport = getReports(data, CONDITION_REPORT);
  const conservationReport = getReports(data, CONSERVATION_REPORT);
  const additionalTextInformation = getAdditionalTextInformation(data);
  const relatedInContentTo = getReference(data, RELATED_IN_CONTENT_TO);
  const similarTo = getReference(data, SIMILAR_TO);
  const belongsTo = getReference(data, BELONGS_TO);
  const graphic = getReference(data, GRAPHIC);
  const partOfWork = getReference(data, PART_OF_WORK, true);

  return `<!doctype html>
  <html lang="de">
    <head>
      <title>cda // ${this.translate("paintings", langCode)} // ${documentTitle}</title>
      ${this.meta()}
      <link href="${this.url('/assets/main.css')}" rel="stylesheet">
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
    
      <section class="leporello-recog">
        ${image}
        <div class="leporello-recog__text">
          ${header}

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
            <figcaption id="image-caption"></figcaption>
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

      <script src="https://cdn.jsdelivr.net/npm/openseadragon@2.4.2/build/openseadragon/openseadragon.min.js"></script>
      <script src="${this.url('/assets/scripts/main.js')}"></script>
    </body>
  </html>`;
};
