exports.getNavigation = (eleventy, langCode) => {
  const config = eleventy.getConfig();
  const cranachSearchURL = config.cranachSearchURL.replace(/langCode/, langCode);
  return `
    <nav class="main-navigation js-navigation">
      <a class="button button--is-transparent js-go-to-search" href="${cranachSearchURL}">
        <span class="button__icon button__icon--is-large icon has-interaction">apps</span>
        <span class="button__text button__text--is-important js-go-to-search-text">${eleventy.translate('zur-suche', langCode)}</span>
      </a>
      <div class="search-result-navigation js-search-result-navigation"></div>
    </nav>
  `;
};
