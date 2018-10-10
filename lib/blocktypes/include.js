'use strict';

var path = require('path');
var utils = require('../utils');

module.exports = include;

function include(content, block, blockLine, blockContent, filePath) {
  var assetPath;
  var l = blockLine.length;
  var fileContent, i;
  var blockExt = path.extname(block.asset);
  var componentFolder;

  if (this.options.htmlComponentFolder || this.options.cssComponentFolder) {
    componentFolder = this.options[blockExt.substr(1) + 'ComponentFolder'];
  }

  if (componentFolder && utils.exists(path.join(componentFolder, block.asset))) {
    assetPath = path.join(componentFolder, block.asset)
  } else {
    assetPath = path.join(path.dirname(filePath), block.asset)
  }

  if (utils.exists(assetPath)) {

    // Recursively process included files
    if (this.options.recursive) {
      fileContent = this.process(assetPath);

    } else {
      fileContent = utils.read(assetPath);
    }

    // Add indentation and remove any last new line
    fileContent = block.indent + fileContent.replace(/(\r\n|\n)$/, '');

    while ((i = content.indexOf(blockLine)) !== -1) {
      content = content.substring(0, i) + fileContent + content.substring(i + l);
    }
  }

  return content;
}
