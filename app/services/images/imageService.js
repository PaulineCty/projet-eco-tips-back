const imageService = {

  /**
   * Attaches the right path to the image file name in order to access it
   * @param {string} image the image file name
   * @returns {string} the complete image path
   */
  getCardImagePath (image) {
    return `/images/cards/${image}`;
  },

  /**
   * Attaches the right path to the achievement image file name in order to access it
   * @param {string} image the image file name
   * @returns {string} the complete achievement image path
   */
  getAchievementImagePath(image) {
    return `/images/achievements/${image}`;
  }


}


module.exports = imageService;


