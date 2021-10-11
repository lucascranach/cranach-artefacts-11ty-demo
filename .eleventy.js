const htmlmin = require('html-minifier');
const markdownIt = require('markdown-it');
const rimraf = require('rimraf');

const paintingsDataDE = require("./src/_data/cda-paintings-v2.de.json");
const translations = require("./src/_data/translations.json");

const markdownItRenderer = new markdownIt();
// const pathPrefix = (process.env.ELEVENTY_ENV === 'production') ? "slides" : "";


module.exports = function (eleventyConfig) {
  eleventyConfig.setUseGitIgnore(false);
  eleventyConfig.setWatchJavaScriptDependencies(true);
  eleventyConfig.addWatchTarget("./src/_components/");


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

  eleventyConfig.addFilter("translate", (term,lang) => {
    return translations[term][lang];
  });


  /* Filter
  ########################################################################## */

  eleventyConfig.addFilter("markdownify", (str) => {
    return markdownItRenderer.renderInline(str);
  });

  /* Collections
  ########################################################################## */

  eleventyConfig.addCollection("paintingsDE", (collection) => {
    return paintingsDE = paintingsDataDE.items.slice(0, 3);
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
