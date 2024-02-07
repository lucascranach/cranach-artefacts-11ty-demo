exports.overallOverview = (eleventy, { content }, langCode) => {
  const { keywords } = content;
  let overallOverview = '';
  
  for (const keyword of keywords) {
    if (keyword.term === '010201') {
      overallOverview = `
      <div class="svg-container">
        <svg viewBox="0 0 100 50">
          <g color="grey">
              <rect id="triptichon_left" class="inactive" x="0" y="0"  width="49%" height="100%" fill="currentcolor"/>
              <rect id="triptichon_right" class="inactive" x="52%" y="0"  width="49%" height="100%" fill="currentcolor"/>
          </g>
            
        </svg>
      </div>
      `;
    } if (keyword.term ==='010202') {
      overallOverview = `
      <div class="svg-container">
        <svg viewBox="0 0 100 50">
          <g color="grey">
            <rect id="triptichon_middle" class="active" x="25%" y="0"  width="46%" height="100%" fill="currentcolor"/>           
          </g>
          <g color="grey">
            <rect id="triptichon_left" class="inactive" x="0" y="0"  width="23%" height="100%" fill="currentcolor"/>
            <rect id="triptichon_right" class="inactive" x="73%" y="0"  width="23%" height="100%" fill="currentcolor"/>
        </g>
            
        </svg>
      </div>
      `;
    } if (keyword.term === '010203') {
      overallOverview = ``;
    }
  }

  return overallOverview.length === 0 ? '' : overallOverview;
};