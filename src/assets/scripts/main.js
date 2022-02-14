/* eslint-disable max-classes-per-file */
// eslint-disable-next-line no-undef
const globalData = objectData;

/* Parse JSON
============================================================================ */
const parseJson = (jsonString) => {
  try {
    return JSON.parse(jsonString);
  } catch (e) {
    return false;
  }
};

/* Global Notification
============================================================================ */
class Notification {
  constructor(content) {
    this.content = content;
    this.id = this.createId();
    this.notification = this.createNotificationHTML();
    this.showNotification();
    this.setNotificationKiller();
  }

  show(element) {
    this.element = element;
    this.element.classList.add('is-visible');
  }

  showNotification() {
    window.setTimeout(this.show, 100, this.notification);
  }

  createNotificationHTML() {
    const notificationText = document.createTextNode(this.content);
    const notification = document.createElement('div');
    notification.id = this.id;
    notification.classList.add('notification');
    notification.appendChild(notificationText);
    document.body.append(notification);
    return document.getElementById(notification.id);
  }

  createId() {
    return this.content.replace(/[^a-zA-Z]/g, '');
  }

  removeNotification(id) {
    const notification = document.getElementById(id);
    notification.parentNode.removeChild(notification);
    window.clearTimeout(this.timeout);
  }

  setNotificationKiller() {
    this.timeout = window.setTimeout(this.removeNotification, 4000, this.id);
  }
}

/* Clipable Element
============================================================================ */
class ClipableElement {
  constructor(ele) {
    this.element = ele;
    this.id = ele.id;
    this.content = ele.dataset.clipableContent;
    this.addAffordance();
  }

  addAffordance() {
    this.element.classList.add('has-interaction', 'is-clipable-content', 'js-copy-to-clipboard');
  }

  copyToClipBoard() {
    const { translations } = globalData;
    const { langCode } = globalData;

    navigator.clipboard.writeText(this.content)
      .then(() => {
        const copiedToClipboard = new Notification(translations.copiedToClipboard[langCode]);
        return copiedToClipboard;
      })
      .catch((err) => {
        const errorMessage = new Notification(`${translations.somethingWentWrong[langCode]} ${err}`);
        return errorMessage;
      });
  }
}

/* Switchable Content
============================================================================ */
class SwitchableContent {
  constructor(ele) {
    this.element = ele;
    this.id = ele.id;
    this.data = parseJson(ele.dataset.jsSwitchableContent);
    this.firstItem = document.getElementById(this.data[0]);
    this.secondItem = document.getElementById(this.data[1]);
    this.addHandle();
    this.addAffordance();
    this.state = 'normal';
  }

  addAffordance() {
    this.element.classList.add('has-interaction', 'js-switch-content');
  }

  switchContent() {
    if (this.state === 'normal') {
      this.firstItem.classList.add('is-cut');
      this.secondItem.classList.remove('is-cut');
      this.state = 'switched';
    } else {
      this.firstItem.classList.remove('is-cut');
      this.secondItem.classList.add('is-cut');
      this.state = 'normal';
    }
  }

  addHandle() {
    const handleIcon = `
      <span class="switchable-content-handle">…</span>
    `;
    const contentElements = this.firstItem.querySelector('.markdown-it').children;
    const target = contentElements[contentElements.length - 1];
    target.innerHTML += handleIcon;
  }
}

/* Additional Content
============================================================================ */
class AdditionalContent {
  constructor(ele) {
    this.element = ele;
    this.id = ele.id;
    this.relatedElement = document.getElementById(this.element.dataset.isAdditionalContentTo);
    this.handlerElement = this.relatedElement.lastElementChild ? this.relatedElement.lastElementChild : this.relatedElement;
    this.hideAdditionalContent();
    this.addHandle();
    this.state = 'is-cut';
  }

  hideAdditionalContent() {
    this.element.classList.add('is-cut');
  }

  collapseElement(ele) {
    this.ele = ele;
    const element = this.ele;
    const sectionHeight = element.scrollHeight;
    const elementTransition = element.style.transition;
    element.style.transition = '';

    requestAnimationFrame(() => {
      element.style.height = `${sectionHeight}px`;
      element.style.transition = elementTransition;

      requestAnimationFrame(() => {
        element.style.height = `${0}px`;
      });
    });
  }

  expandElement(ele) {
    this.ele = ele;
    const sectionHeight = this.ele.scrollHeight;
    this.ele.style.height = `${sectionHeight}px`;
  }

  toggleContent() {
    if (this.state === 'is-cut') {
      this.expandElement(this.element);
      this.relatedElement.classList.add('is-hidden');
      this.state = 'is-expanded';
      this.relatedElement.dataset.additionalContentState = this.state;
      this.element.classList.remove('is-cut');
    } else {
      this.collapseElement(this.element);
      this.relatedElement.classList.remove('is-hidden');
      this.state = 'is-cut';
      this.relatedElement.dataset.additionalContentState = this.state;
      this.element.classList.add('is-cut');
    }
  }

  addHandle() {
    this.handlerElement.classList.add('has-additional-content-handler');
    this.relatedElement.classList.add('has-additional-content', 'js-expand-additional-content');
    this.relatedElement.dataset.additionalContentState = 'is-cut';
    this.relatedElement.dataset.fullDataElement = this.id;
  }
}

/* Toggle Literature Details
============================================================================ */
const toggleLiteratureDetails = (referenceId) => {
  const headId = `litRef${referenceId}`;
  const dataId = `litRefData${referenceId}`;
  document.getElementById(headId).classList.toggle('is-active');
  document.getElementById(dataId).classList.toggle('is-visible');
};

/* ImageViewer
============================================================================ */
class ImageViewer {
  constructor(id, captionId) {
    // eslint-disable-next-line no-undef
    this.viewer = OpenSeadragon({
      id,
      // eslint-disable-next-line no-undef
      prefixUrl: `${globalData.asseturl}/images/icons/`,
      tileSources: {
        type: 'image',
        // eslint-disable-next-line no-undef
        url: `${globalData.asseturl}/images/no-image-l.svg`,
      },
    });

    this.activeTrigger = false;
    this.caption = document.getElementById(captionId);
    this.imageStripeItems = document.querySelectorAll('[data-js-change-image]');
  }

  adaptUrl(url) {
    this.url = url;
    const prodPath = globalData.imageBasePath.production;
    const devPath = globalData.imageBasePath.development;
    return url.replace(prodPath, devPath, this.url);
  }

  addAdditionalContentInteraction(captionId) {
    this.captionId = captionId;
    const caption = document.getElementById(this.captionId);
    globalData.additionalContentElements[captionId] = new AdditionalContent(caption);
  }

  addClipboardInteraction(id) {
    this.id = id;
    if (!globalData.clipableElements) return;
    const element = document.getElementById(this.id);
    globalData.clipableElements[id] = new ClipableElement(element);
  }

  setCaption(img) {
    // if (!img.metadata) return '';
    const { metadata } = img;
    const captionId = 'ImageDescTitle';
    const description = !metadata || !metadata.description
      ? ''
      : `<h3 id="${captionId}" 
          class="image-caption__title is-expand-trigger" data-js-expanded="true"
          data-js-expandable="completeImageData">
          ${metadata.description}</h3>`;

    const getCompleteImageData = (id, data) => {
      const rows = data.map((item) => `
            <tr><td class="info-table__title">${item.name}:</td><td class="info-table__data">${item.content}</td></tr>
          `);

      return rows.length === 0 ? '' : `
        <div id="completeImageData" class="expandable-content">
          <table class="info-table is-two-third is-tight">
            ${rows.join('')}
          </table>
        </div>
      `;
    };

    const fileName = `
      <span id="${img.id}" data-clipable-content="${img.id}">${img.id}</span>
    `;
    const data = [];
    const { translations } = globalData;
    const { langCode } = globalData;
    data.push({ name: translations.fileName[langCode], content: fileName });
    if (metadata && metadata.fileType) data.push({ name: translations.kindOfImage[langCode], content: metadata.fileType });
    if (metadata && metadata.date) data.push({ name: translations.date[langCode], content: metadata.date });
    if (metadata && metadata.created) data.push({ name: translations.authorAndRights[langCode], content: metadata.created });
    if (metadata && metadata.source) data.push({ name: translations.source[langCode], content: metadata.source });

    const completeData = getCompleteImageData(captionId, data);

    const caption = `
      ${description}
      ${completeData}
    `;

    this.caption.innerHTML = caption;
    this.addClipboardInteraction(img.id);
  }

  handleTrigger(trigger) {
    if (this.activeTrigger) { this.activeTrigger.classList.remove('is-active'); }
    trigger.classList.add('is-active');
    this.activeTrigger = trigger;
  }

  showImage(type, id, trigger) {
    const { imageStack } = globalData;
    const { env } = globalData;
    const img = imageStack[type].images.filter((image) => image.id === id).shift();
    const initialUrl = img.sizes.tiles.src;
    const url = env.match(/development/) ? this.adaptUrl(initialUrl) : initialUrl;

    if (trigger) this.handleTrigger(trigger);
    this.setCaption(img);
    this.viewer.open(url);
  }

  filterImageStripe(element) {
    const imageType = element.value;
    this.imageStripeItems.forEach((item) => {
      const type = item.dataset.imageType;
      item.classList.remove('is-hidden');
      if (type !== imageType && imageType !== 'all') item.classList.add('is-hidden');
    });
  }
}

/* Expand & Reduce Blocks
============================================================================ */
const expandReduce = (trigger, targetId) => {
  document.getElementById(targetId).classList.toggle('is-visible');
  trigger.classList.toggle('is-expanded');
};

/* Search Results in Local Storage
============================================================================ */
const getSearchResults = () => {
  const searchResult = localStorage.getItem('searchResult');
  if (!searchResult) return false;
  return parseJson(searchResult);
};

/* Handle Arrow Keys
============================================================================ */
const handleArrowAction = (key, searchResults) => {
  const searchResultIds = searchResults.map((entry) => (entry.id));

  if (!globalData.inventoryNumber) return;
  const { inventoryNumber } = globalData;
  const indexInSearchResults = searchResultIds.indexOf(inventoryNumber);

  if (indexInSearchResults === -1) return;
  if (key === 'ArrowLeft' && indexInSearchResults === 0) return;

  const targetId = key === 'ArrowLeft'
    ? searchResultIds[indexInSearchResults - 1]
    : searchResultIds[indexInSearchResults + 1];

  const targetUrl = window.location.href.replace(inventoryNumber, targetId);
  window.location.href = targetUrl;
};

/* Expand & Reduce Text
============================================================================ */
const expandReduceText = (trigger, state) => {
  const triggerElement = trigger;
  if (state === 'isExpanded') {
    triggerElement.dataset.jsFoldableText = trigger.innerHTML;
    triggerElement.innerHTML = '';
    triggerElement.classList.remove('is-expanded');
  } else {
    triggerElement.innerHTML = state;
    triggerElement.dataset.jsFoldableText = 'isExpanded';
    triggerElement.classList.add('is-expanded');
  }
};

/* Search Result Navigation
============================================================================ */
const setSearchResultNavigation = (element, searchResults) => {
  const target = element;

  if (!globalData.inventoryNumber) return;
  const { inventoryNumber } = globalData;

  if (!searchResults || !Array.isArray(searchResults)) return;

  const { translations } = globalData;
  const { langCode } = globalData;

  const searchResultIds = searchResults.map((entry) => (entry.id));
  const pos = searchResultIds.findIndex((id) => id === inventoryNumber);

  const prev = pos > 0 ? searchResults[pos - 1] : false;
  const next = pos < searchResults.length ? searchResults[pos + 1] : false;

  const entityTypePath = parseJson(globalData.entityTypePath);
  const prevPathPrefix = prev ? entityTypePath[prev.entityType] : false;
  const nextPathPrefix = next ? entityTypePath[next.entityType] : false;

  const prevArtefactHtml = !prev ? ''
  // eslint-disable-next-line max-len
    : `<a class="nav-item" href="../../${prevPathPrefix}/${prev.id}">
    <span class="nav-item__icon" style="background-image: url(${prev.imgSrc})">&lt;</span>
    <span class="nav-item__text">${translations.prevWork[langCode]}</span>
    </a>`;

  const nextArtefactHtml = !next ? ''
  // eslint-disable-next-line max-len
    : `<a class="nav-item" href="../../${nextPathPrefix}/${next.id}">
    <span class="nav-item__text">${translations.nextWork[langCode]}</span>
    <span class="nav-item__icon" style="background-image: url(${next.imgSrc})">&gt;</span>
    </a>`;

  target.innerHTML = `<div class="nav">${prevArtefactHtml}${nextArtefactHtml}</div>`;
};

/* Reduce Navigation on Scroll
============================================================================ */
const reduceNavigation = () => {
  const navigation = document.querySelector('.js-navigation');
  navigation.classList.add('is-sticky');

  const leporello = document.querySelector('.js-main-content');
  if (!leporello) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) {
        navigation.classList.add('is-reduced');
      } else {
        navigation.classList.remove('is-reduced');
      }
    });
  }, { threshold: 1 });
  observer.observe(leporello);
};

/* Main
============================================================================ */

document.addEventListener('DOMContentLoaded', (event) => {
  const searchResults = getSearchResults();

  /* Switchable Content
  --------------------------------------------------------------------------  */
  const switchableContentList = document.querySelectorAll('[data-js-switchable-content]');
  const switchableContentElements = [];
  switchableContentList.forEach((element) => {
    switchableContentElements[element.id] = new SwitchableContent(element);
  });

  /* Additional Content
  --------------------------------------------------------------------------  */
  const additionalContentList = document.querySelectorAll('.js-additional-content');
  globalData.additionalContentElements = [];
  additionalContentList.forEach((element) => {
    globalData.additionalContentElements[element.id] = new AdditionalContent(element);
  });

  /* Clipboard
  --------------------------------------------------------------------------  */
  if (navigator.clipboard) {
    const clipableElementList = document.querySelectorAll('[data-clipable-content]');
    globalData.clipableElements = [];

    clipableElementList.forEach((ele, index) => {
      const element = ele;
      const id = element.id ? element.id : `genId-${Date.now()}-${index}`;
      if (!element.id) { element.id = id; }
      globalData.clipableElements[id] = new ClipableElement(element);
    });
  }

  /* Image viewer
  --------------------------------------------------------------------------  */
  let imageViewer;
  if (document.querySelector('.main-image-wrap') !== null) {
    imageViewer = new ImageViewer('viewer-content', 'image-caption');
    const firstImageInStripe = document.querySelector('[data-js-change-image]');
    const firstImageData = parseJson(firstImageInStripe.dataset.jsChangeImage);
    imageViewer.showImage(firstImageData.key, firstImageData.id, firstImageInStripe);
  }

  /* Search Result Navigation
  --------------------------------------------------------------------------  */
  if (document.querySelector('.search-result-navigation') !== null) {
    const element = document.querySelector('.search-result-navigation');
    setSearchResultNavigation(element, searchResults);
  }

  /* Expand blocks
  --------------------------------------------------------------------------  */
  const expandableBlocks = document.querySelectorAll('[data-js-expanded=true]');
  expandableBlocks.forEach((block) => {
    expandReduce(block, block.dataset.jsExpandable);
  });

  /* Intersections
  --------------------------------------------------------------------------  */
  if (window.IntersectionObserver) {
    reduceNavigation();
  }

  /* Go to Search Button
  --------------------------------------------------------------------------  */
  if (document.querySelector('.js-go-to-search') !== null) {
    const element = document.querySelector('.js-go-to-search');
    const { href } = element;

    const searchQueryParams = localStorage.getItem('searchQueryParams');
    if (href && searchQueryParams) { 
      element.href = `${href}?${searchQueryParams}`;
    }
  }

  /* Events
  --------------------------------------------------------------------------  */
  document.addEventListener('click', (ev) => {
    const { target } = ev;
    
    if (target.dataset.jsToggleLiterature) {
      event.preventDefault();
      toggleLiteratureDetails(target.dataset.jsToggleLiterature);
    }

    if (target.dataset.jsExpandable) {
      event.preventDefault();
      expandReduce(target, target.dataset.jsExpandable);
    }

    if (target.dataset.jsFoldableText) {
      event.preventDefault();
      expandReduceText(target, target.dataset.jsFoldableText);
    }

    if (target.dataset.jsChangeImage) {
      const data = parseJson(target.dataset.jsChangeImage);
      imageViewer.showImage(data.key, data.id, target);
    }

    if (target.closest('.js-switch-content')) {
      const element = target.closest('.js-switch-content');
      const { id } = element;
      switchableContentElements[id].switchContent();
    }

    if (target.closest('.js-expand-additional-content')) {
      const element = target.closest('.js-expand-additional-content');
      const id = element.dataset.fullDataElement;
      globalData.additionalContentElements[id].toggleContent();
    }

    if (target.closest('.js-collapse-additional-content')) {
      const element = target.closest('.js-collapse-additional-content');
      const { id } = element.parentNode;
      globalData.additionalContentElements[id].toggleContent();
    }

    if (target.closest('.js-copy-to-clipboard')) {
      const element = target.closest('.js-copy-to-clipboard');
      const { id } = element;
      globalData.clipableElements[id].copyToClipBoard();
    }
  }, true);

  document.addEventListener('keydown', (ev) => {
    const keyEvent = ev;

    if (keyEvent.key && (keyEvent.key === 'ArrowLeft' || keyEvent.key === 'ArrowRight')) {
      handleArrowAction(keyEvent.key, searchResults);
    }
  });

  document.addEventListener('change', (ev) => {
    const { target } = ev;

    if (target.dataset.jsImageSelector) {
      imageViewer.filterImageStripe(target);
    }
  }, false);
});
