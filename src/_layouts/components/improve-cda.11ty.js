exports.getImproveCDA = (eleventy, { content }, config, langCode) => {
  const title = encodeURI(content.metadata.title);
  const objectUrl = encodeURI(content.url);
  const issueUrls = config.issueReportUrl;
  const improveCdaHeadline = eleventy.translate('improveCdaHeadline', langCode);
  const or = eleventy.translate('or', langCode);
  const contactUs = eleventy.translate('contactUs', langCode);
  const youHaveAdditionalInformation = eleventy.translate('youHaveAdditionalInformation', langCode);
  const additionalInformationUrl = issueUrls.contentBug.replace(/\{title}/, title).replace(/\{url}/, objectUrl);
  const foundABug = eleventy.translate('foundABug', langCode);
  const foundABugUrl = issueUrls.functionalBug.replace(/\{title}/, title).replace(/\{url}/, objectUrl);
  return `
      <h2>${improveCdaHeadline}</h2>
      <p>${contactUs} <a href="${foundABugUrl}" target="_blank">${foundABug}</a> ${or} <a href="${additionalInformationUrl}" target="_blank">${youHaveAdditionalInformation}</a></p>
    `;
}
