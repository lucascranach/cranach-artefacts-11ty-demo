exports.getSources = (eleventy, { content }, langCode, hasGrayBackground = false) => {

  const prefix = content.metadata.id;
  const additionalCss = hasGrayBackground ? 'with-gray-background' : '';
  const getLiteraturDetails = (item) => {
    const author = item && item.persons ? item.persons.filter((person) => person.role === 'AUTHOR').map((person) => person.name) : [];
    const publisher = item && item.persons
      ? item.persons.filter((person) => person.role === 'PUBLISHER' || person.role === 'UNKNOWN').map((person) => person.name) : [];
    const editing = item && item.persons ? item.persons.filter((person) => person.role === 'EDITORIAL_STAFF').map((person) => person.name) : [];
    const alternateNumbers = (!item || !item.alternateNumbers) ? [] : item.alternateNumbers.map((alternateNumber) => `
        ${alternateNumber.description}
        ${alternateNumber.number}
      `);

    const getRow = (rowContent, translationID) => (!rowContent ? ''
      : `<tr><th>${eleventy.translate(translationID, langCode)}</th><td>${eleventy.stripTags(rowContent)}</td></tr>`);

    return `
      <table class="literature-item-details-table">
        ${getRow(author.join(', '), 'author')}
        ${getRow(publisher.join(', '), 'publisher')}
        ${getRow(editing.join(', '), 'editing')}
        ${item && item.title ? getRow(item.title, 'title') : ''}
        ${item && item.subtitle ? getRow(item.subtitle, 'publication') : ''}
        ${item && item.pages ? getRow(item.pages, 'pages') : ''}
        ${item && item.series ? getRow(item.series, 'series') : ''}
        ${item && item.volume ? getRow(item.volume, 'volume') : ''}
        ${item && item.journal ? getRow(item.journal, 'journal') : ''}
        ${item && item.issue ? getRow(item.issue, 'issue') : ''}
        ${item && item.publication ? getRow(item.publication, 'publication') : ''}
        ${item && item.publishLocation ? getRow(item.publishLocation, 'publishLocation') : ''}
        ${item && item.publishDate ? getRow(item.publishDate, 'publishDate') : ''}
        ${item && item.periodOfOrigin ? getRow(item.periodOfOrigin, 'periodOfOrigin') : ''}
        ${item && item.physicalDescription ? getRow(item.physicalDescription, 'physicalDescription') : ''}
        ${item && item.mention ? getRow(item.mention, 'mention') : ''}
        ${item && item.link ? getRow(item.link, 'permalink') : ''}
        ${item && item.pageNumbers ? getRow(item.pageNumbers, 'pages') : ''}
        ${getRow(alternateNumbers.join(', '), 'alternativeNumbers')}
        ${item && item.copyright ? getRow(item.copyright, 'link') : ''}
      </table>
    `;
  };

  const publicationListData = content.publications.map((item) => {
    const itemWithReferenceData = item;
    itemWithReferenceData.referenceData = eleventy.getLitRef(item.referenceId, langCode);
    return itemWithReferenceData;
  });
  const publicationListDataByDate = publicationListData.sort((a, b) => {
    if (!a.referenceData) return 0;
    if (!b.referenceData) return 0;
    const dateA = a.referenceData.publishDate ? a.referenceData.publishDate : a.referenceData.date;
    const dateB = b.referenceData.publishDate ? b.referenceData.publishDate : b.referenceData.date;
    return dateB - dateA;
  });
  const publicationList = publicationListDataByDate.map(
    (item, index) => {
      const litRef = eleventy.getLitRef(item.referenceId, langCode);
      const litRefTableData = eleventy.getLitRefTableData(item.referenceData, content.metadata.id);
      const hasBackground = index % 2 ? 'has-bg' : '';
      return `
        <tr
          class="row ${hasBackground} is-head" 
          id="litRef${item.referenceId}-${index}">

          <td class="cell has-interaction"><a href="#" data-js-toggle-literature="${item.referenceId}-${index}">${item.title}</a></td>
          <td class="cell">${item.pageNumber} </td>
          <td class="cell">${litRefTableData.catalogNumber}</td>
          <td class="cell">${litRefTableData.figureNumber}</td>
        </tr>
        <tr class="row ${hasBackground} is-detail" id="litRefData${item.referenceId}-${index}">
          <td class="cell" colspan="4">
            ${getLiteraturDetails(litRef)}
          </td>
        </tr>
        `;
    },
  );

  const publications = content.publications ? `
    <div class="foldable-block has-strong-separator"> 
      <h2 class="foldable-block__headline is-expand-trigger" data-js-expanded="false" data-js-expandable="${prefix}-literature-list">
        ${eleventy.translate('literature', langCode)}</h2>
      <div id="${prefix}-literature-list" class="expandable-content">
        <table class="table literature">
          <thead class="head ${additionalCss}">
            <tr class="row">
              <td class="cell" style="width: 40%"></td>
              <td class="cell" style="width: 20%">${eleventy.translate('referenceOnPage', langCode)}</td>
              <td class="cell" style="width: 20%">${eleventy.translate('catalogueNumber', langCode)}</td>
              <td class="cell" style="width: 20%">${eleventy.translate('plate', langCode)}</td>
            </tr>
          </thead>
          <tbody class="body">
          ${publicationList.join('\n')}
          </tbody>
        </table>
      </div>
    </div>` : '';

  return content.publications.length === 0 ? '' : publications;
};