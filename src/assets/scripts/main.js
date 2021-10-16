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
  constructor(id) {
    this.viewer = OpenSeadragon({
      id,
      prefixUrl: '/assets/images/icons/',
      tileSources: {
        type: 'image',
        url: '/assets/images/no-image-l.svg',
      },
    });
  }

  adaptUrl(url) {
    const prodPath = imageBasePath['production'];
    const devPath = imageBasePath['development'];
    return url.replace(prodPath, devPath, url);
  }

  setImage(url) {
    url = env==='development' ? this.adaptUrl(url) : url;
    this.viewer.open(url);
  }
}


handleEvents();

const imageViewer = new ImageViewer("image-viewer");
imageViewer.setImage(imageStack.overall.images[0].sizes.tiles.src);
