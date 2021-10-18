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
      prefixUrl: '/assets/images/icons/',
      tileSources: {
        type: 'image',
        url: '/assets/images/no-image-l.svg',
      },
    });

    this.activeTrigger = false;
    this.caption = document.getElementById(captionId);
  }

  adaptUrl(url) {
    const prodPath = imageBasePath['production'];
    const devPath = imageBasePath['development'];
    return url.replace(prodPath, devPath, url);
  }

  setCaption(img) {
    const metadata = img.metadata[langCode];
    const fileType = !metadata.fileType ? '' : `<li class="image-description-title">${metadata.fileType}</li>`;
    const description = !metadata.description ? '' : `<li class="image-description-text">${metadata.description}</li>`;
    const date = !metadata.date ? '' : `<li class="image-description-date">${metadata.date}</li>`;
    const author = !metadata.created ? '' : `
      <dt class="definition-list__term">${translations['authorAndRights'][langCode]}</dt>
      <dd class="definition-list__definition"><p class="flat-text">${metadata.created}</p></dd>
    `;
    const source = !metadata.source ? '' : `
      <dt class="definition-list__term">${translations['source'][langCode]}</dt>
      <dd class="definition-list__definition"><p class="flat-text">${metadata.source}</p></dd>
    `;
    const caption = `
    <ul class="image-description">
      ${fileType}${date}
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

  showImage(type, index, trigger) {
    
    const img = imageStack[type].images[index];
    const initialUrl = img.sizes.tiles.src;
    const url = env==='development' ? this.adaptUrl(initialUrl) : initialUrl;
    
    if (trigger) this.handleTrigger(trigger);
    this.setCaption(img);
    this.viewer.open(url);
  }
}

/* Main
============================================================================ */

document.addEventListener("DOMContentLoaded", function(event) {
  
  const imageViewer = new ImageViewer("viewer-content", "image-caption");
  const firstImageInStripe = document.querySelector("[data-js-change-image]");
  const firstImageData = JSON.parse(firstImageInStripe.dataset.jsChangeImage);
  imageViewer.showImage(firstImageData.key, firstImageData.index, firstImageInStripe);
  
  document.addEventListener('click', (event) => {
    const { target } = event;

    if (target.dataset.jsToggleLiterature) {
      event.preventDefault();
      toggleLiteratureDetails(target.dataset.jsToggleLiterature);
    }
    
    if (target.dataset.jsChangeImage) {
      const data = JSON.parse(target.dataset.jsChangeImage);
      imageViewer.showImage(data.key, data.index, target);
    }

  }, true);

});


