window.globals = {};
window.globalFunctions = {};

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
    element.classList.add("is-visible");
  }

  showNotification() {
    window.setTimeout(this.show, 100, this.notification);
  }

  createNotificationHTML() {
    const notificationText = document.createTextNode(this.content);
    const notification = document.createElement("div");
    notification.id = this.id;
    notification.classList.add("notification");
    notification.appendChild(notificationText); 
    document.body.append(notification);
    return document.getElementById(notification.id);
  }

  createId() {
    return this.content.replace(/[^a-zA-Z]/g, "");
  }

  removeNotification(id) {
    const notification = document.getElementById(id);
    notification.parentNode.removeChild(notification);
    window.clearTimeout(this.timeout);
  }

  setNotificationKiller() {
    this.timeout = window.setTimeout(this.removeNotification, 2000, this.id);
  }

}

/* Toggle Literature Details
============================================================================ */
const toggleLiteratureDetails = (referenceId) => {
  const headId = `litRef${referenceId}`;
  const dataId = `litRefData${referenceId}`;
  document.getElementById(headId).classList.toggle('is-active');
  document.getElementById(dataId).classList.toggle('is-visible');
}

/* ImageViewer
============================================================================ */
class ImageViewer {
  constructor(id, captionId) {
    this.viewer = OpenSeadragon({
      id,
      prefixUrl: `${asseturl}/images/icons/`,
      tileSources: {
        type: 'image',
        url: `${asseturl}/images/no-image-l.svg`,
      },
    });

    this.activeTrigger = false;
    this.caption = document.getElementById(captionId);
    this.imageStripeItems = document.querySelectorAll("[data-js-change-image]");
  }

  adaptUrl(url) {
    const prodPath = imageBasePath['production'];
    const devPath = imageBasePath['development'];
    return url.replace(prodPath, devPath, url);
  }

  addAdditionalContentInteraction(captionId) {
    const caption = document.getElementById(captionId);
    globals.additionalContentElements[captionId] = new AdditionalContent(caption);
    return;
  }

  addClipboardInteraction(id) {
    const element = document.getElementById(id);
    globals.clipableElements[id] = new ClipableElement(element);
  }

  setCaption(img) {
    if (!img.metadata) return;
    const metadata = img.metadata;
    const captionId = "ImageDescTitle";
    const description = !metadata.description ? '' : `<li id="${captionId}" class="image-description-title">${metadata.description}</li>`;

    const getCompleteImageData = (id, data) => {
      const rows = data.map(item => {
        return `
            <tr><td class="info-table__title">${item.name}:</td><td class="info-table__data">${item.content}</td></tr>
          `;
      });
  
      return rows.length === 0 ? '' : `
        <table id="completeData${id}" class="info-table is-additional-content js-additional-content is-two-third is-tight" data-is-additional-content-to="${id}">
          ${rows.join("")}
        </table>
      `;
    }
    
    const fileName = `
      <span id="${img.id}" data-clipable-content="${img.id}">${img.id}</span>
    `;
    const data = [];
    data.push({ "name": translations['fileName'][langCode], "content": fileName });
    if (metadata.created) data.push({ "name": translations['authorAndRights'][langCode], "content": metadata.created });
    if (metadata.source) data.push({ "name": translations['source'][langCode], "content": metadata.source });
    if (metadata.date) data.push({ "name": translations['date'][langCode], "content": metadata.date });
    if (metadata.fileType) data.push({ "name": translations['kindOfImage'][langCode], "content": metadata.fileType });

    const completeData = getCompleteImageData(captionId, data);

    const caption = `
      <ul class="image-description is-secondary">
        ${description}
        ${completeData}
      </ul>
    `;
    
    this.caption.innerHTML = caption;
    this.addAdditionalContentInteraction(`completeData${captionId}`);
    this.addClipboardInteraction(img.id);
  }

  handleTrigger(trigger) {
    if (this.activeTrigger) { this.activeTrigger.classList.remove("is-active"); }
    trigger.classList.add("is-active");
    this.activeTrigger = trigger;
    return;
  }

  showImage(type, id, trigger) {
    
    const img = imageStack[type].images.filter(image => image.id === id).shift();
    const initialUrl = img.sizes.tiles.src;
    const url = env==='development' ? this.adaptUrl(initialUrl) : initialUrl;
    
    if (trigger) this.handleTrigger(trigger);
    this.setCaption(img);
    this.viewer.open(url);
  }

  filterImageStripe(element) {
    const imageType = element.value;
    this.imageStripeItems.forEach(item => {
      const type = item.dataset.imageType;
      item.classList.remove("is-hidden");
      if (type !== imageType && imageType !== "all") item.classList.add("is-hidden");
    });
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
    this.element.classList.add("has-interaction", "is-clipable-content", "js-copy-to-clipboard");
  }

  copyToClipBoard() {
    navigator.clipboard.writeText(this.content)
      .then(() => {
          new Notification(translations['copiedToClipboard'][langCode]);
    })
        .catch(err => {
          new Notification(translations['somethingWentWrong'][langCode]);
    })
  }
}

/* Switchable Content
============================================================================ */
class SwitchableContent {
  constructor(ele) {
    this.element = ele;
    this.id = ele.id;
    this.data = JSON.parse(ele.dataset.jsSwitchableContent);
    this.firstItem = document.getElementById(this.data[0]);
    this.secondItem = document.getElementById(this.data[1]);
    this.addHandle();
    this.addAffordance();
    this.state = "normal";
  }

  addAffordance() {
    this.element.classList.add("has-interaction", "js-switch-content");
  }

  switchContent() {
    if (this.state === "normal") {
      this.firstItem.classList.add("is-cut");
      this.secondItem.classList.remove("is-cut");
      this.state = "switched";
    } else {
      this.firstItem.classList.remove("is-cut");
      this.secondItem.classList.add("is-cut");
      this.state = "normal";
    }
  }

  addHandle() {
    const handleIcon = `
      <span class="switchable-content-handle">…</span>
    `;
    const contentElements = this.firstItem.querySelector(".markdown-it").children;
    const target = contentElements[contentElements.length-1];
    target.innerHTML += handleIcon;
  }
}

/* Additional Content
============================================================================ */
class AdditionalContent {
  constructor(ele) {
    this.element = ele;
    this.id = ele.id; 
    this.relatedPreviewElement = document.getElementById(this.element.dataset.isAdditionalContentTo);
    this.wrapText();
    this.hideAdditionalContent();
    this.addHandle();
    this.state = "is-hidden";
  }

  hideAdditionalContent() {
    this.element.classList.add("is-hidden");
  }

  wrapText() {
    this.relatedPreviewElement.innerHTML = `<span class="preview-text">${this.relatedPreviewElement.innerHTML}</span>`;
  }

  toggleContent() {
    if (this.state === "is-hidden") {
      this.element.classList.remove("is-hidden");
      this.relatedPreviewElement.dataset.additionalContentState = "is-visible";
      this.state = "is-visible";
    } else {
      this.element.classList.add("is-hidden");
      this.relatedPreviewElement.dataset.additionalContentState = "is-hidden";
      this.state = "is-hidden";
    }
  }

  addHandle() {
    this.relatedPreviewElement.classList.add("has-additional-content", "js-toggle-additional-content");
    this.relatedPreviewElement.dataset.additionalContentState = "is-hidden";
    this.relatedPreviewElement.dataset.fullDataElement= this.id;
  }
}

/* Expand & Reduce Blocks
============================================================================ */
const expandReduce = (trigger, targetId) => {
  document.getElementById(targetId).classList.toggle("is-visible");
  trigger.classList.toggle("is-expanded");
}

/* Expand & Reduce Text
============================================================================ */
const expandReduceText = (trigger, state) => {

  if (state === 'isExpanded') {
    trigger.dataset.jsFoldableText = trigger.innerHTML;
    trigger.innerHTML = '';
    trigger.classList.remove("is-expanded");
  } else {
    trigger.innerHTML = state;
    trigger.dataset.jsFoldableText = 'isExpanded';
    trigger.classList.add("is-expanded");
  }
}

/* Main
============================================================================ */

document.addEventListener("DOMContentLoaded", function (event) {
  
  /* Switchable Content
  --------------------------------------------------------------------------  */
  const switchableContentList= document.querySelectorAll("[data-js-switchable-content]");
  const switchableContentElements = [];
  switchableContentList.forEach(element => {
    switchableContentElements[element.id] = new SwitchableContent(element);
  });

  /* Additional Content
  --------------------------------------------------------------------------  */
  const additionalContentList= document.querySelectorAll(".js-additional-content");
  globals.additionalContentElements = [];
  additionalContentList.forEach(element => {
    globals.additionalContentElements[element.id] = new AdditionalContent(element);
  });
  
  /* Clipboard 
  --------------------------------------------------------------------------  */
  if (navigator.clipboard) {
    const clipableElementList = document.querySelectorAll("[data-clipable-content]");
    globals.clipableElements = [];
    clipableElementList.forEach((element, index) => {
      const id = element.id ? element.id : `genId-${Date.now()}-${index}`;
      if (!element.id) element.id = id;
      globals.clipableElements[id] = new ClipableElement(element);
    });
  }

  /* Image viewer
  --------------------------------------------------------------------------  */
  const imageViewer = new ImageViewer("viewer-content", "image-caption");
  const firstImageInStripe = document.querySelector("[data-js-change-image]");
  const firstImageData = JSON.parse(firstImageInStripe.dataset.jsChangeImage);
  imageViewer.showImage(firstImageData.key, firstImageData.id, firstImageInStripe);
  
  /* Expand blocks
  --------------------------------------------------------------------------  */
  const expandableBlocks = document.querySelectorAll("[data-js-expanded=true]");
  expandableBlocks.forEach(block => {
    expandReduce(block, block.dataset.jsExpandable);
  });

  /* Events
  --------------------------------------------------------------------------  */
  document.addEventListener('click', (event) => {
    const target = event.target;
    
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
      const data = JSON.parse(target.dataset.jsChangeImage);
      imageViewer.showImage(data.key, data.id, target);
    }
    
    if (target.closest('.js-switch-content')) {
      const element = target.closest('.js-switch-content');
      const id = element.id;
      switchableContentElements[id].switchContent();
    }

    if (target.closest('.js-toggle-additional-content')) {
      const element = target.closest('.js-toggle-additional-content');
      const id = element.dataset.fullDataElement;
      globals.additionalContentElements[id].toggleContent();
    }

    if (target.closest('.js-copy-to-clipboard')) {
      const element = target.closest('.js-copy-to-clipboard');
      const id = element.id;
      globals.clipableElements[id].copyToClipBoard();
    }

  }, true);

  document.addEventListener('change', (event) => {
    const { target } = event;
  
    if (target.dataset.jsImageSelector) {
      imageViewer.filterImageStripe(target);
    }

  }, false);

});


