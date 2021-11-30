const htmlmin = require('html-minifier');
const markdownIt = require('markdown-it');
const fs = require('fs');

const config = {
  "generatePaintings": false,
  "imageTiles": {
    "development": "https://lucascranach.org/data-proxy/image-tiles.php?obj=",
    "production": "https://lucascranach.org/imageserver-2021"
  },
  "issueReportUrl": {
    "functionalBug": "https://github.com/lucascranach/cda-orga/issues/new?assignees=cnoss&labels=bug&template=functional-bug.yml&title=%5BFunctional+Bug%5D%3A+",
    "contentBug": "https://github.com/lucascranach/cda-orga/issues/new?assignees=cnoss&labels=Content&template=extra-information.yml&title=%5BIMPROVEMENT%5D%3A+",
  },
  "cranachBaseUrl": "https://lucascranach.org",
  "cranachSearchURL": "https://lucascranach.org/search",
  "documentsBasePath": "https://lucascranach.org/documents",
  "contentTypes": {
    "overall": {
      "fragment": "Overall",
      "sort": "01"
    },
    "reverse": {
      "fragment": "Reverse",
      "sort": "02"
    },
    "irr": {
      "fragment": "IRR",
      "sort": "03"
    },
    "xRadiograph": {
      "fragment": "X-radiograph",
      "sort": "04"
    },
    "uvLight": {
      "fragment": "UV-light",
      "sort": "05"
    },
    "detail": {
      "fragment": "Detail",
      "sort": "06"
    },
    "photomicrograph": {
      "fragment": "Photomicrograph",
      "sort": "07"
    },
    "conservation": {
      "fragment": "Conservation",
      "sort": "08"
    },
    "other": {
      "fragment": "Other",
      "sort": "09"
    },
    "analysis": {
      "fragment": "Analysis",
      "sort": "10"
    },
    "rkd": {
      "fragment": "RKD",
      "sort": "11"
    },
    "koe": {
      "fragment": "KOE",
      "sort": "12"
    },
    "transmittedLight": {
      "fragment": "Transmitted-light",
      "sort": "13"
    }
  }
}

const paintingsData = {
  "de": require("./src/_data/cda-paintings-v2.de.json"),
  "en": require("./src/_data/cda-paintings-v2.en.json")
}

const literatureData = {
  "de": require("./src/_data/cda-literaturereferences-v2.de"),
  "en": require("./src/_data/cda-literaturereferences-v2.en")
};
const translations = require("./src/_data/translations.json");
const translationsClient = require("./src/_data/translations-client.json");

const markdownItRenderer = new markdownIt('commonmark', {
  html: true,
  breaks: true,
  linkify: true,
  typographer: true
});

const simpleMarkdownItRenderer = new markdownIt('commonmark', {
  html: true,
  breaks: true,
  linkify: true,
  typographer: true
}).disable([ 'list' ]);

const pathPrefix = (process.env.ELEVENTY_ENV === 'production') ? "paintings" : "";

const markRemarks = str => {
  const mark = (match, str) => {
    return `<span class="is-remark">[${str}]</span>`;
  }
  str = str.replace(/\[(.*)]/g, mark);
  return str;
}

const clearRequireCache = () => {
  
  Object.keys(require.cache).forEach(function (key) {
    if (require.cache[key].filename.match(/11ty\.js/)) {
      delete require.cache[key];
    }
  });  
}

const getPaintingsCollection = (lang) => {
  const paintingsForLang = paintingsData[lang];
  const devObjects = ["AT_KHM_GG861a","AT_KHM_GG861","AT_KHM_GG886","AT_KHM_GG856","AT_KHM_GG858","PRIVATE_NONE-P449","AR_MNdBABA_8632","AT_KHM_GG860","AT_KHM_GG885","AT_KHM_GG3523","PRIVATE_NONE-P443","PRIVATE_NONE-P450","AT_SZ_SZ25-416-129","CZ_NGP_O9619","CH_PTSS-MAS_A653","CH_SORW_1925-1b","DE_AGGD_15","DE_StMB_NONE-001c","AT_KHM_GG6905", "DE_StMT","DE_StMB_NONE-001d"];
  // "DE_smbGG_1907", "DE_WSCH_NONE-WSCH001A", "DE_KBG-Lost_NONE-KBG001a", "DE_BStGS_1416", "DE_StSKA_002B", "DE_SKD_GG1906A", "DE_StMT", "AT_KHM_GG6905", "DE_SKD_GG1906A", "FIN_FNG_S-1994-224"
  const paintings = process.env.ELEVENTY_ENV === 'production'
    ? paintingsForLang.items
    : paintingsForLang.items.filter(item => devObjects.includes(item.inventoryNumber));
  
  let sortedPaintings = paintings.sort((a, b)=>{
    if (a.sortingNumber < b.sortingNumber) return -1;
    if (a.sortingNumber > b.sortingNumber) return 1;
    return 0;
  });

  return sortedPaintings;
}

const markdownify = (str, mode = 'full') => {

  function replacePre(match, str) {
    const items = str.split("\n\n").map(line => {
      if (line) return `<li><p>${line}</p></li>`;
    });

    return `<ul class="is-block">${items.join("")}</ul>`;
  }

  let renderedText = mode === 'full' ? markdownItRenderer.render(str) : simpleMarkdownItRenderer.render(str);
  renderedText = renderedText.replace(/<pre><code>(.*?)<\/code><\/pre>/sg, replacePre);

  return `<div class="markdown-it">${renderedText}</div>`;
}

const appendToFile = (path, str) => {
  const filepath = `./${path}`;
  fs.appendFileSync(filepath, str);
}


module.exports = function (eleventyConfig) {
  eleventyConfig.setWatchThrottleWaitTime(100);
  eleventyConfig.setUseGitIgnore(false);
  eleventyConfig.setWatchJavaScriptDependencies(true);
  eleventyConfig.setBrowserSyncConfig({
    snippet: true,
  });
  /* Compilation
    ########################################################################## */

  // Watch our js for changes
  eleventyConfig.addWatchTarget('./src/assets/scripts/main.js');
  // eleventyConfig.addWatchTarget('./src/_layouts/components/');

  // Copy _data
  eleventyConfig.addPassthroughCopy({ 'src/_data': 'assets/data' });
  eleventyConfig.addWatchTarget("./src/_data");

  // Watch our compiled assets for changes
  eleventyConfig.addPassthroughCopy('src/compiled-assets');
  // eleventyConfig.addWatchTarget('./src/compiled-assets');

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
    if (!translations[term]) {
      console.log(`Translation for ${term} in lang ${lang} is missing.`);
      process.abort();
    }
    return translations[term][lang];
  });

  eleventyConfig.addJavaScriptFunction("getBaseUrl", () => {
    return config.cranachBaseUrl;
  });

  eleventyConfig.addJavaScriptFunction("getConfig", () => {
    return config;
  });

  eleventyConfig.addJavaScriptFunction("getLitRef", (ref, lang) => {
    const literatureReference = literatureData[lang].items.filter(item => item.referenceId === ref);
    return literatureReference.shift();
  });

  eleventyConfig.addJavaScriptFunction("getRefObjectMeta", (collection, id) => {
    const reference = collection.filter(item => item.inventoryNumber === id);

    if (!reference[0]) return false;
    const metadata = reference[0].metadata;
    metadata.owner = reference[0].owner;

    return metadata;
  });

  eleventyConfig.addJavaScriptFunction("getLitRefTableData", (ref, id) => {
    if (!ref || !ref.connectedObjects) return '';
    const connectedObjects = ref.connectedObjects.filter(item => item.inventoryNumber === id);
    return connectedObjects.shift();
  });

  eleventyConfig.addJavaScriptFunction("getRemarkDataTable", (id, data, hideElement, title) => {
    const rows = data.map(item => {
      const remark = item.remark ? `<td class="info-table__remark">${markdownify(item.remark)}</td>` : '<td class="info-table__remark">-</td>';
      return `
          <tr><td class="info-table__data">${markdownify(item.text)}</td>${remark}</tr>
        `;
    });

    return rows.length === 0 ? '' : `
      <div id="completeData${id}" class="additional-content js-additional-content" data-is-additional-content-to="${hideElement}">
        <h2 class="additional-content__title js-collapse-additional-content has-interaction">${title}</h2>
        <table class="info-table additional-content__table">
          ${rows.join("")}
        </table>
      </div>
    `;
  });

  eleventyConfig.addJavaScriptFunction("getStructuredDataFromString", (str) => {
    const lines = str.split(/\n/s);
    const structuredData = [];
    let textsPerEntry = [];
    let sourcesPerEntry = [];  
    const addToStructure = (texts, sources) => {
      structuredData.push({
        'text': texts.join("<br>"),
        'remark': sources.join("<br>"),
      });
      mode = 'collectDimensions';
      dimensionsPerEntry = [];
      sourcesPerEntry = [];
    }
    let mode = 'collectTexts';
    lines.forEach(line => {
      if (!line.match(/[a-zA-Z]/)) return;
      if (!line.match(/\[/)) {
        if (mode === 'collectSources') {
          addToStructure(textsPerEntry, sourcesPerEntry);
          mode = 'collectTexts';
          textsPerEntry = [];
          sourcesPerEntry = [];
        }
        textsPerEntry.push(line);
      } else {
        mode = 'collectSources';
        sourcesPerEntry.push(line);
      }
    });
    addToStructure(textsPerEntry, sourcesPerEntry);
    return structuredData;
  });

  eleventyConfig.addJavaScriptFunction("getFormatedText", (str, option = false) => {
    str = str.replace(/\n/g, "\n\n");
    str = str.replace(/\n\n\n/g, "\n\n");
    const renderMode = option && option === "no-lists" ? 'simple' : 'full';
    return markdownify(str, renderMode);
  });

  eleventyConfig.addJavaScriptFunction("getENV", () => {
    return process.env.ELEVENTY_ENV;
  });

  eleventyConfig.addJavaScriptFunction("getTranslations", () => {
    return translations;
  });

  eleventyConfig.addJavaScriptFunction("getClientTranslations", () => {
    return translationsClient;
  });

  eleventyConfig.addJavaScriptFunction("log", ({ content }) => {
    console.log(`\nWorking on ${content.inventoryNumber}`);
  });

  eleventyConfig.addJavaScriptFunction("convertTagsInText", (str) => {
    return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  });


  /* Filter
  ########################################################################## */

  eleventyConfig.addFilter("markdownify", (str) => {
    str =  markdownify(str);
    return markRemarks(str);
  });

  eleventyConfig.addFilter("altText", (str) => {
    return str ? str.replace(/"/g, "\'") : 'no alt text';
  });

  eleventyConfig.addFilter("stripTags", (str) => {
    return str.replace(/<.*?>/g, "");
  });

  eleventyConfig.addFilter("slugify", (str) => {
    str = str.replace(/^\s+|\s+$/g, '').toLowerCase();
    const from = "ÁÄÂÀÃÅČÇĆĎÉĚËÈÊẼĔȆÍÌÎÏŇÑÓÖÒÔÕØŘŔŠŤÚŮÜÙÛÝŸŽáäâàãåčçćďéěëèêẽĕȇíìîïňñóöòôõøðřŕšťúůüùûýÿžþÞĐđßÆa·/_,:;",
      to = "AAAAAACCCDEEEEEEEEIIIINNOOOOOORRSTUUUUUYYZaaaaaacccdeeeeeeeeiiiinnooooooorrstuuuuuyyzbBDdBAa------";
    for (var i = 0, l = from.length; i < l; i++) {
      str = str.replace(new RegExp(from.charAt(i), 'g'), to.charAt(i));
    }
    return str.replace(/[^a-z0-9 -]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-');
  });

  /* Collections
  ########################################################################## */

  eleventyConfig.addCollection("paintingsDE", () => {
    clearRequireCache();
    const paintingsCollectionDE = !config.generatePaintings
    ? []
    : getPaintingsCollection('de')
    return paintingsCollectionDE;
  });

  eleventyConfig.addCollection("paintingsEN", () => {
    const paintingsCollectionEN = !config.generatePaintings
      ? []
      : process.env.ELEVENTY_ENV === 'developmentDE' ? [] : getPaintingsCollection('en');
    return paintingsCollectionEN;
  });


  /* Shortcodes
  ########################################################################## */


  /* Environment
  ########################################################################## */

  if (process.env.ELEVENTY_ENV === 'production') {
    eleventyConfig.addTransform('htmlmin', (content, outputPath) => {
      if (outputPath.endsWith('.html')) {
        return content;
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
    pathPrefix,
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
