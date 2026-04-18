module.exports = function(eleventyConfig) {
  // limit filter — returns the first N items of an array
  eleventyConfig.addFilter("limit", (arr, n) => arr.slice(0, n));

  // pass through screenshot images for the witness archive
  eleventyConfig.addPassthroughCopy("src/witness/screenshots");

  // pass through lab directory — games, experiments, interactive pieces
  // files here are served as-is (HTML, JS, canvas games, pico-8 exports)
  eleventyConfig.addPassthroughCopy("src/lab");

  return {
    dir: {
      input: "src",
      output: "_site"
    }
  };
};
