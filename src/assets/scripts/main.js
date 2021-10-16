const handleEvents = () => {
  document.addEventListener('click', (event) => {
    const { target } = event;

    if (target.dataset.jsToggleLiterature) {
      event.preventDefault();
      toggleLiteratureDetails(target.dataset.jsToggleLiterature);
    }

  }, true);
}

const toggleLiteratureDetails = (referenceId) => {
  const headId = `litRef${referenceId}`;
  const dataId = `litRefData${referenceId}`;
  document.getElementById(headId).classList.toggle('is-active');
  document.getElementById(dataId).classList.toggle('is-visible');
}

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
    const description = !metadata.description ? '' : `<li class="image-description-title">${metadata.description}</li>`;
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
      ${fileType}${description}${date}
      <li class="image-description-text">
        <dl class="definition-list">
          ${author}
          ${source}
        </dl>
      </li>
    </ul>
    `;
    this.caption.innerHTML = caption;
  }

  setImage(img) {
    const initialUrl = img.sizes.tiles.src;
    const url = env==='development' ? this.adaptUrl(initialUrl) : initialUrl;
    
    this.setCaption(img);
    this.viewer.open(url);
  }
}


handleEvents();

const imageViewer = new ImageViewer("viewer-content", "image-caption");
imageViewer.setImage(imageStack.overall.images[0]);
