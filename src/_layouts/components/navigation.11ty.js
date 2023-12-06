exports.getNavigation = (eleventy, langCode, objectId, type) => {
  const config = eleventy.getConfig();
  const cranachSearchURL = `${config.cranachSearchURL.replace(/langCode/, langCode)}?loadLatestSearchConfiguration=true`;
  const urlDe = `${eleventy.getBaseUrl()}/de/${objectId}/`;
  const urlEn = `${eleventy.getBaseUrl()}/en/${objectId}/`;
  const text = type === 'literature' ? 'zur-literatursuche' : 'zur-werksuche';
  const icon = type === 'literature' ? 'reorder' : 'apps';
  const isActiveDe = langCode === 'de' ? 'lang-selector__item--is-active' : '';
  const isActiveEn = langCode === 'en' ? 'lang-selector__item--is-active' : '';

  return `
    <nav class="main-navigation js-navigation">
      <a class="button button--is-transparent js-go-to-search" href="${cranachSearchURL}">
        <span class="button__icon button__icon--is-large icon has-interaction">${icon}</span>
        <span class="button__text button__text--is-important js-go-to-search-text">${eleventy.translate(text, langCode)}</span>
      </a>
      <div class="secondary-navigation">
        <div class="options js-options">
          <ul class="switcher lang-selector" data-state="inactive" data-component="base/interacting/switcher">
            <li class="switcher-item "><a class="lang-selector__item ${isActiveDe}" href="${urlDe}">DE</a></li>
            <li class="switcher-item "><a class="lang-selector__item ${isActiveEn}" href="${urlEn}">EN</a></li>
          </ul>
          <button 
            class="button button--is-transparent button__icon button__icon--is-large icon 
            has-interaction options__trigger" data-state="inactive"></button>
        </div>
        <div class="search-result-navigation js-search-result-navigation"></div>
      </div>
    </nav>
  `;
};
