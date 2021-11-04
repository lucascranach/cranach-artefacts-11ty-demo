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

  setCaption(img) {

    if (!img.metadata) return;
    const metadata = img.metadata;
    
    const date = !metadata.date ? '' : `, ${metadata.date}`;
    const fileType = !metadata.fileType ? '' : `<li class="image-description-title">${metadata.fileType}${date}</li>`;
    const description = !metadata.description ? '' : `<li class="image-description-text">${metadata.description}</li>`;
    const author = !metadata.created ? '' : `
      <dt class="definition-list__term">${translations['authorAndRights'][langCode]}</dt>
      <dd class="definition-list__definition"><p class="flat-text">${metadata.created}</p></dd>
    `;
    const source = !metadata.source ? '' : `
      <dt class="definition-list__term">${translations['source'][langCode]}</dt>
      <dd class="definition-list__definition"><p class="flat-text">${metadata.source}</p></dd>
    `;
    const caption = `
    <ul class="image-description is-secondary">
      ${fileType}
      <li class="image-description-text">
        <dl class="definition-list">
          ${author}
          ${source}
        </dl>
      </li>
      ${description}
    </ul>
    `;
    
    this.caption.innerHTML = caption;
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
    this.relatedPreviewElement = document.getElementById(ele.dataset.isAdditionalContentTo);
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
  const additionalContentElements = [];
  additionalContentList.forEach(element => {
    additionalContentElements[element.id] = new AdditionalContent(element);
  });
  
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
      additionalContentElements[id].toggleContent();
    }

  }, true);

  document.addEventListener('change', (event) => {
    const { target } = event;
  
    if (target.dataset.jsImageSelector) {
      imageViewer.filterImageStripe(target);
    }

  }, false);

});


