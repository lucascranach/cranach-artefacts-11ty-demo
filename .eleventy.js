const htmlmin = require('html-minifier');
const markdownIt = require('markdown-it');
const rimraf = require('rimraf');

const devConfig = {
  "imageTiles":{
     "development":"https://lucascranach.org/data-proxy/image-tiles.php?obj=",
     "production":"https://lucascranach.org/imageserver-2021"
  },
  "imageTypes":{
     "overall":{
        "fragment":"Overall",
        "sort":"01"
     },
     "reverse":{
        "fragment":"Reverse",
        "sort":"02"
     },
     "irr":{
        "fragment":"IRR",
        "sort":"03"
     },
     "xRadiograph":{
        "fragment":"X-radiograph",
        "sort":"04"
     },
     "uvLight":{
        "fragment":"UV-light",
        "sort":"05"
     },
     "detail":{
        "fragment":"Detail",
        "sort":"06"
     },
     "photomicrograph":{
        "fragment":"Photomicrograph",
        "sort":"07"
     },
     "conservation":{
        "fragment":"Conservation",
        "sort":"08"
     },
     "other":{
        "fragment":"Other",
        "sort":"09"
     },
     "analysis":{
        "fragment":"Analysis",
        "sort":"10"
     },
     "rkd":{
        "fragment":"RKD",
        "sort":"11"
     },
     "koe":{
        "fragment":"KOE",
        "sort":"12"
     },
     "transmittedLight":{
        "fragment":"Transmitted-light",
        "sort":"13"
     }
  },
}

const paintingsDataDE = require("./src/_data/cda-paintings-v2.de.json");
const literatureData = {
  "de": require("./src/_data/cda-literaturereferences-v2.de")
};
const translations = require("./src/_data/translations.json");

const markdownItRenderer = new markdownIt('commonmark', {
  html: true,
  breaks: true,
  linkify: true,
  typographer: true
});
// const pathPrefix = (process.env.ELEVENTY_ENV === 'production') ? "slides" : "";

const cdaBaseUrl = "https://lucascranach.org";

module.exports = function (eleventyConfig) {
  eleventyConfig.setUseGitIgnore(false);
  eleventyConfig.setWatchJavaScriptDependencies(true);
  // eleventyConfig.addWatchTarget("./src/_components/");


  /* Compilation
    ########################################################################## */

  // Watch our compiled assets for changes
  eleventyConfig.addWatchTarget('./src/compiled-assets/main.css');
  eleventyConfig.addWatchTarget('./src/assets/scripts/main.js');

  // Copy _data
  eleventyConfig.addPassthroughCopy({ 'src/_data': 'assets/data' });
  eleventyConfig.addWatchTarget("./src/_data");

  // Copy src/compiled-assets to /assets
  eleventyConfig.addPassthroughCopy({ 'src/compiled-assets': 'assets' });

  // Copy all fonts
  eleventyConfig.addPassthroughCopy({ 'src/assets/fonts': 'assets/fonts' });

  // Copy asset images
  eleventyConfig.addPassthroughCopy({ 'src/assets/images': 'assets/images' });


  // Copy Scripts
  eleventyConfig.addPassthroughCopy({ 'src/assets/scripts': 'assets/scripts' });
  eleventyConfig.addWatchTarget("./src/assets/scripts");

  /* Functions
  ########################################################################## */

  eleventyConfig.addJavaScriptFunction("translate", (term, lang) => {
    return translations[term][lang];
  });

  eleventyConfig.addJavaScriptFunction("getBaseUrl", () => {
    return cdaBaseUrl;
  });

  eleventyConfig.addJavaScriptFunction("getConfig", () => {
    return devConfig;
  });

  eleventyConfig.addJavaScriptFunction("getLiteratureReference", (ref, lang) => {
    const literatureReference = literatureData[lang].items.filter(item => item.referenceId === ref);
    return literatureReference.shift();
  });

  eleventyConfig.addJavaScriptFunction("getLiteratureReferenceTableData", (ref, id) => {
    if (!ref || !ref.connectedObjects) return '';
    const connectedObjects = ref.connectedObjects.filter(item => item.inventoryNumber === id);
    return connectedObjects.shift();
  });

  eleventyConfig.addJavaScriptFunction("getENV", () => {
    return process.env.ELEVENTY_ENV;
  });

  eleventyConfig.addJavaScriptFunction("getTranslations", () => {
    return translations;
  });

  /* Filter
  ########################################################################## */

  eleventyConfig.addFilter("markdownify", (str, modus) => {
    if (modus === "log") {
      console.log(str);
    }
    return `<div class="markdown-it">${markdownItRenderer.render(str)}</div>`;
  });

  eleventyConfig.addFilter("altText", (str) => {
    return str.replace(/"/g, "\'");
  });

  eleventyConfig.addFilter("stripTags", (str) => {
    return str.replace(/<.*?>/g, "");
  });

  /* Collections
  ########################################################################## */

  eleventyConfig.addCollection("paintingsDE", (collection) => {
    return paintingsDE = paintingsDataDE.items.slice(2, 3);
  });

  /* Shortcodes
  ########################################################################## */

  eleventyConfig.addShortcode('meta', () => {
    return `<meta name="robots" content="noindex">
    <meta name="googlebot" content="noindex">
    <meta name="googlebot-news" content="noindex">
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
`});


  /* Environment
  ########################################################################## */

  if (process.env.ELEVENTY_ENV === 'production') {
    eleventyConfig.addTransform('htmlmin', (content, outputPath) => {
      if (outputPath.endsWith('.html')) {
        return minified = htmlmin.minify(content, {
          collapseInlineTagWhitespace: false,
          collapseWhitespace: true,
          removeComments: true,
          sortClassName: true,
          useShortDoctype: true,
        });
      }

      return content;
    });
  }

  return {
    dir: {
      includes: '_components',
      input: 'src',
      layouts: '_layouts',
      output: 'docs',
    },
    pathPrefix: '',
    markdownTemplateEngine: 'njk',
    htmlTemplateEngine: 'njk',
    templateFormats: [
      'md',
      'html',
      'njk',
      '11ty.js'
    ],
  };
};
