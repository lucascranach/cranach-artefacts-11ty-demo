const htmlmin = require('html-minifier');
const markdownIt = require('markdown-it');
const fs = require('fs');
const eleventyFetch = require("@11ty/eleventy-fetch");

// fs.unlinkSync('missing-files.txt');

const logMissedLinks = 'missing-files.txt';
if (fs.existsSync(logMissedLinks)) {
  fs.unlinkSync(logMissedLinks);
}

const config = {
  "dist": "./docs",
  "compiledContent": "./compiled-content",
  "graphicPrefix": "GWN_",
  "generatePaintings": true,
  "generateArchivals": false,
  "generateGraphicsVirtualObjects": true,

  "imageTiles": {
    "development": "https://lucascranach.org/data-proxy/image-tiles.php?obj=",
    "production": "https://lucascranach.org/imageserver-2022"
  },
  "issueReportUrl": {
    "bug": "https://docs.google.com/forms/d/e/1FAIpQLSdtb8vAaRUZAZZUijLP099GFMm279HpbZBdVA5KZf5tnLZVCw/viewform?usp=pp_url&entry.810636170=artefactTitle&entry.1357028798=artefactUrl",
  },
  "cranachBaseUrl": {
    "production": "https://lucascranach.org",
    "development": "http://localhost:8080",
  },
  "cranachSearchURL": "https://lucascranach.org/langCode/search",
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
    "x_radiograph": {
      "fragment": "X-radiograph",
      "sort": "04"
    },
    "uv_light": {
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
    "transmitted_light": {
      "fragment": "Transmitted-light",
      "sort": "13"
    }
  }
}

const kklGroupShortcuts = {
  "I": "filters=catalog:catalog.KKL.I&page=1",
  "II": "filters=catalog:catalog.KKL.II&page=1",
  "III": "filters=catalog:catalog.KKL.III&page=1",
  "IV": "filters=catalog:catalog.KKL.IV&page=1",
  "V": "filters=catalog:catalog.KKL.V&page=1"
};

const paintingsData = {
  "de": require("./src/_data/cda-paintings-v2.de.json"),
  "en": require("./src/_data/cda-paintings-v2.en.json")
}

const archivalsData = {
  "de": require("./src/_data/cda-archivals-v2.de.json"),
  "en": require("./src/_data/cda-archivals-v2.en.json")
}

const graphicsRealObjectData = {
  "de": require("./src/_data/cda-graphics-v2.real.de.json"),
  "en": require("./src/_data/cda-graphics-v2.real.en.json")
}

const graphicsVirtualObjectData = {
  "de": require("./src/_data/cda-graphics-v2.virtual.de.json"),
  "en": require("./src/_data/cda-graphics-v2.virtual.en.json")
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

const pathPrefix = (process.env.ELEVENTY_ENV === 'production') ? "artefacts" : "";

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
  const devObjects = ["DE_MKKM_1232BRD","PRIVATE_NONE-P411","UK_BMAG_K1650","DK_SMK_KMS3674", "US_CMA_1953-143", "DE_LHW_G25","ANO_H-NONE-019","DE_KSW_G9", "AT_KHM_GG885", "AT_KHM_GG861a","AT_KHM_GG861","AT_KHM_GG886","AT_KHM_GG856","AT_KHM_GG858","PRIVATE_NONE-P449","AR_MNdBABA_8632","AT_KHM_GG860","AT_KHM_GG885","AT_KHM_GG3523","PRIVATE_NONE-P443","PRIVATE_NONE-P450","AT_SZ_SZ25-416-129","CZ_NGP_O9619","CH_PTSS-MAS_A653","CH_SORW_1925-1b","DE_AGGD_15","DE_StMB_NONE-001c","AT_KHM_GG6905", "DE_StMT","DE_StMB_NONE-001d", "AT_KHM_GG6739", "PRIVATE_NONE-P409","CH_SORW_1925-1a"];

  const paintings = process.env.ELEVENTY_ENV === 'production'
    ? paintingsForLang.items
    : paintingsForLang.items.filter(item => devObjects.includes(item.inventoryNumber));
  
  const sortablePaintings = paintings.map(item => {
    const itemWithSortValue = item;
    itemWithSortValue.sortValue = `${item.sortingInfo.year}-${item.sortingInfo.position}`;

    return itemWithSortValue;
  });
  
  let sortedPaintings = sortablePaintings.sort((a, b) => {
    if (a.sortValue < b.sortValue) return -1;
    if (a.sortValue > b.sortValue) return 1;
    return 0;
  });
  if (lang === "de") { 
    const ids = sortedPaintings.map(item => { 
      if (item.sortingNumber.match(/\-/)) { 
        // appendToFile("ids.txt", `${item.inventoryNumber}\t${item.sortingNumber}\n`)
      }
    });
  }


  return sortedPaintings;
}

const getArchivalsCollection = (lang) => {
  const archivalsForLang = archivalsData[lang];
  const devObjects = ["PRIVATE_NONE-P409", "DE_LHW_G25","ANO_H-NONE-019","DE_KSW_G9", "AT_KHM_GG885", "AT_KHM_GG861a","AT_KHM_GG861","AT_KHM_GG886","AT_KHM_GG856","AT_KHM_GG858","PRIVATE_NONE-P449","AR_MNdBABA_8632","AT_KHM_GG860","AT_KHM_GG885","AT_KHM_GG3523","PRIVATE_NONE-P443","PRIVATE_NONE-P450","AT_SZ_SZ25-416-129","CZ_NGP_O9619","CH_PTSS-MAS_A653","CH_SORW_1925-1b","DE_AGGD_15","DE_StMB_NONE-001c","AT_KHM_GG6905", "DE_StMT","DE_StMB_NONE-001d", "AT_KHM_GG6739"];

  const archivals = process.env.ELEVENTY_ENV === 'production'
    ? archivalsForLang.items
    : archivalsForLang.items; // .filter(item => devObjects.includes(item.inventoryNumber));
  
  let sortedArchivals = archivals.sort((a, b) => {
    if (a.period < b.period) return -1;
    if (a.period > b.period) return 1;
    return 0;
  });

  return sortedArchivals;
}



const getGraphicsRealObjectsCollection = (lang) => {
  const graphicsRealObjectsForLang = graphicsRealObjectData[lang];
  const sortedGraphicsRealObjects = graphicsRealObjectsForLang.items.sort((a, b)=>{
    if (a.sortingNumber < b.sortingNumber) return -1;
    if (a.sortingNumber > b.sortingNumber) return 1;
    return 0;
  });

  return sortedGraphicsRealObjects;
}

const getGraphicsVirtualObjectsCollection = (lang) => {
  const graphicsVirtualObjectsForLang = graphicsVirtualObjectData[lang];
  const devObjects = ["ANO_H-NONE-002", "ANO_H-NONE-017","ANO_HVI-7-6", "HBG_HVI-8_7-4", "HB_HIV-259-595"];
  
  const graphicsVirtualObjects = process.env.ELEVENTY_ENV === 'production'
    ? graphicsVirtualObjectsForLang.items
    : graphicsVirtualObjectsForLang.items.filter(item => devObjects.includes(item.inventoryNumber));

  const sortedGraphicsVirtualObjects = graphicsVirtualObjects.sort((a, b)=>{
    if (a.sortingNumber < b.sortingNumber) return -1;
    if (a.sortingNumber > b.sortingNumber) return 1;
    return 0;
  });

  return sortedGraphicsVirtualObjects.filter(item => item.metadata.imgSrc.match(/[a-z]/));
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

const objectsForNavigation = (() => {
  const paintings = getPaintingsCollection("de");
  const graphics = getGraphicsVirtualObjectsCollection("de");
  const allArtefacts = { ...paintings, ...graphics }
  const allArtefactsArray = [];

  for (const [key, value] of Object.entries(allArtefacts)) {
    allArtefactsArray.push(value);
  }
  
  const sortedArtefactsArray = allArtefactsArray.sort((a, b) => a.sortingNumber.localeCompare(b.sortingNumber));
  const objectsForNavigation = sortedArtefactsArray.map(item => {
    const { sortingNumber } = item;
    const { entityType } = item;
    const id = item.metadata.id;
    const imgSrc = item.metadata.imgSrc;

    return {
      id, imgSrc, sortingNumber, entityType
    };
  });

  return objectsForNavigation;
})()

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
  eleventyConfig.addPassthroughCopy('./compiled-content');

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

  eleventyConfig.addJavaScriptFunction("getKklGroupLinkData", (kklNr, lang) => {
    if (!kklNr) return;
    const searchUrl = config.cranachSearchURL.replace(/langCode/, lang);
    const kklGroupId = kklNr.replace(/\..*/, "");
    const searchParam = kklGroupShortcuts[kklGroupId];
    return {
      "url": `${searchUrl}?${searchParam}`,
      kklGroupId
    };
  });

  eleventyConfig.addJavaScriptFunction("checkRessource", async (url) => {
    try { 
      await eleventyFetch(url, {
        duration: "1d",
        type: "buffer"
      });
    } catch (error) {
      appendToFile(logMissedLinks, `${url}\n`)
    }


  });

  eleventyConfig.addJavaScriptFunction("writeDocument", (dir, filename, content) => {
  
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, {
        recursive: true
      });
    }

    const path = `${dir}/${filename}`;

    try {
      fs.writeFileSync(path, content);
      return true;
    } catch (err) {
      console.error(err)
    }
  });
  
  eleventyConfig.addJavaScriptFunction("getBaseUrl", () => {
    return process.env.ELEVENTY_ENV === 'production'
      ? config.cranachBaseUrl.production
      : config.cranachBaseUrl.development;
  });

  eleventyConfig.addJavaScriptFunction("getConfig", () => {
    return config;
  });

  eleventyConfig.addJavaScriptFunction("getLitRef", (ref, lang = 'en') => {
    const literatureReference = literatureData[lang].items.filter(item => item.referenceId === ref);
    return literatureReference.shift();
  });

  eleventyConfig.addJavaScriptFunction("getReprintRefItem", (ref, lang) => {
    const reprintRefItemData = graphicsRealObjectData[lang].items.filter(item => item.metadata.id === ref);
    if (reprintRefItemData.length === 0) return;
    
    const reprintRefItem = reprintRefItemData.shift();
    return {
      'id': reprintRefItem.metadata.id,
      'title': reprintRefItem.metadata.title,
      'date': reprintRefItem.metadata.date,
      'conditionLevel': Number(reprintRefItem.conditionLevel),
      'repository': reprintRefItem.repository,
      'sortingNumber': reprintRefItem.sortingNumber,
      'imgSrc': reprintRefItem.metadata.imgSrc,
    };
  });

  eleventyConfig.addJavaScriptFunction("getReprintData", (ref, lang) => {

    const reprintRefItemData = graphicsRealObjectData[lang].items.filter(item => item.metadata.id === ref);
    if (reprintRefItemData.length === 0) return;

    return reprintRefItemData.shift();

  });

  eleventyConfig.addJavaScriptFunction("getRefObjectMeta", (collection, id) => {
    if (!collection) return {};
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

  eleventyConfig.addJavaScriptFunction("getRemarkDataTable", (objectData) => {

    const { content } = objectData;
    const { title } = objectData;
    const { context } = objectData;
    const { isAdditionalContentTo }  = objectData;
    const { id } = objectData;
    const { additionalCellClass } = objectData;

    const rows = content.map(item => {
      const remark = item.remark ? `<td class="info-table__remark">${markdownify(item.remark)}</td>` : '<td class="info-table__remark">-</td>';
      return `
          <tr><td class="info-table__data ${additionalCellClass}">${markdownify(item.text)}</td>${remark}</tr>
        `;
    });

    return rows.length === 0 ? '' : `
      <div id="${context}-completeData${id}" 
        class="additional-content js-additional-content"
        data-is-additional-content-to="${isAdditionalContentTo}">
        <h2 class="additional-content__title js-collapse-additional-content has-interaction">${title}</h2>
        <table class="info-table additional-content__table">
          ${rows.join("")}
        </table>
      </div>
    `;
  });

  eleventyConfig.addJavaScriptFunction("getDataList", (objectData) => {

    const content = objectData.content;
    const title = objectData.title;
    const context = objectData.context;
    const isAdditionalContentTo = objectData.isAdditionalContentTo;
    const id = objectData.id;
    
    const items = content.map(item => {
      return `<li class="info-list__item">${markdownify(item)}</li>`;
    });

    return items.length === 0 ? '' : `
      <div id="${context}-completeData${id}" 
        class="additional-content js-additional-content"
        data-is-additional-content-to="${isAdditionalContentTo}">
        <h2 class="additional-content__title js-collapse-additional-content has-interaction">${title}</h2>
        <ul class="info-list additional-content__list">
          ${items.join("")}
        </ul>
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
    // console.log(`\nWorking on ${content.inventoryNumber}`);
  });

  eleventyConfig.addJavaScriptFunction("convertTagsInText", (str) => {
    return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  });

  eleventyConfig.addJavaScriptFunction("getReprintUrl", (id, langCode) => {
    return `${langCode}/${id}/`;
  });

  eleventyConfig.addJavaScriptFunction("getObjectsForNavigation", (id) => {
    const objectIds = objectsForNavigation.map((entry) => (entry.id));
    const pos = objectIds.findIndex((navObjectId) => id === navObjectId);
  
    const prev = pos > 0 ? objectsForNavigation[pos - 1] : false;
    const next = pos < objectIds.length ? objectsForNavigation[pos + 1] : false;
    
    return {
      prev, next
    }
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
    const paintingsCollectionDE = config.generatePaintings === false
      ? []
      : getPaintingsCollection('de');
    return paintingsCollectionDE;
  });

  eleventyConfig.addCollection("paintingsEN", () => {
    const paintingsCollectionEN = config.generatePaintings === false || process.env.ELEVENTY_ENV === 'developmentDE'
      ? []
      : getPaintingsCollection('en');
    return paintingsCollectionEN;
  });

  eleventyConfig.addCollection("graphicsRealObjectsDE", () => {
    const graphicsRealObjectsDE = !config.generateGraphicsRealObjects
      ? []
      : getGraphicsRealObjectsCollection('de');
    return graphicsRealObjectsDE;
  });

  eleventyConfig.addCollection("graphicsRealObjectsEN", () => {
    const graphicsRealObjectsEN = !config.generateGraphicsRealObjects
      ? []
      : getGraphicsRealObjectsCollection('en');
    return graphicsRealObjectsEN;
  });

  eleventyConfig.addCollection("graphicsVirtualObjectsDE", () => {
    const graphicsVirtualObjectsDE = !config.generateGraphicsVirtualObjects
      ? []
      : getGraphicsVirtualObjectsCollection('de');
    return graphicsVirtualObjectsDE;
  });

  eleventyConfig.addCollection("graphicsVirtualObjectsEN", () => {
    const graphicsVirtualObjectsEN = !config.generateGraphicsVirtualObjects
      ? []
      : getGraphicsVirtualObjectsCollection('en');
    return graphicsVirtualObjectsEN;
  });

  eleventyConfig.addCollection("archivalsDE", () => {
    const archivalsDE = !config.generateArchivals
      ? []
      : getArchivalsCollection('de');
    return archivalsDE;
  });

  eleventyConfig.addCollection("archivalsEN", () => {
    const archivalsEN = !config.generateArchivals
      ? []
      : getArchivalsCollection('en');
    return archivalsEN;
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
      output: config.dist,
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
