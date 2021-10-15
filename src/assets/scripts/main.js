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


handleEvents();