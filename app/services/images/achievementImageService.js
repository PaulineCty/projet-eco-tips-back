/**
   * Attaches the right path to the achievement image file name in order to access it
   * @param {string} image the image file name
   * @returns {string} the complete achievement image path
   */
function getAchievementImagePath(image) {
    return `/achievementImages/${image}`;
}
  
module.exports = getAchievementImagePath;