module.exports = function(eleventyConfig) {
  // pass through screenshot images for the witness archive
  eleventyConfig.addPassthroughCopy("src/witness/screenshots");

  return {
    dir: {
      input: "src",
      output: "_site"
    }
  };
};
