/**
   * Attaches the right path to the image file name in order to access it
   * @param {string} image the image file name
   * @returns {string} the complete image path
   */
function getImagePath(image) {
  return `/images/${image}`;
}

module.exports = getImagePath;


