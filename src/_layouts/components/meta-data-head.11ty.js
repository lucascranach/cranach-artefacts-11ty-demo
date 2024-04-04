exports.getHeader = ({ content }) => {
  const descLength = 150;
  const title = content.metadata.title.replace(/"/g, '\'').replace(/<(.*?)>/g, '');
  const { url } = content;
  const image = content.metadata.imgSrc;
  const desc = content.description && content.description.length > descLength
    ? `${content.description.substr(0, descLength)} …`
    : content.description;

  const now = new Date();
  const currentDay= now.getDate();
  const currentMonth = now.getMonth() +1;
  const currentYear = now.getFullYear();
  const currentHour = now.getHours();
  const currentMinute = now.getMinutes();
  const publishDate = `${currentYear}-${currentMonth}-${currentDay} ${currentHour}:${currentMinute} CET`;

  const matomo = `
    <!-- Matomo -->
    <script>
      var _paq = window._paq = window._paq || [];
      /* tracker methods like "setCustomDimension" should be called before "trackPageView" */
      _paq.push(["setDocumentTitle", document.domain + "/" + document.title]);
      _paq.push(["setDomains", ["*.lucascranach.org"]]);
      _paq.push(["disableCookies"]);
      _paq.push(['trackPageView']);
      _paq.push(['enableLinkTracking']);
      (function() {
        var u="//lucascranach.org/matomo/";
        _paq.push(['setTrackerUrl', u+'matomo.php']);
        _paq.push(['setSiteId', '1']);
        var d=document, g=d.createElement('script'), s=d.getElementsByTagName('script')[0];
        g.async=true; g.src=u+'matomo.js'; s.parentNode.insertBefore(g,s);
      })();
    </script>
    <!-- End Matomo Code -->
  `;
  
  return `
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta property="og:title" content="${title}">
    <meta property="og:description" content="${desc}">
    <meta property="og:url" content="${url}">
    <meta property="og:image" content="${image}">
    <meta property="og:type" content="website">
    <meta name="description" content="${desc}">
    <meta property="article:published_time" content="${publishDate}">
    <meta name="author" content="Cranach Digital Archive Team // TH Köln">
    ${matomo}
  `;
};
