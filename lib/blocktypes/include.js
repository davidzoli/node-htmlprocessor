'use strict';

var path = require('path');
var utils = require('../utils');

module.exports = include;

function include(content, block, blockLine, blockContent, filePath) {
  var assetPath;
  var l = blockLine.length;
  var fileContent, i;

  if (this.options.componentFolder && utils.exists(path.join(this.options.componentFolder, block.asset))) {
      assetPath = path.join(this.options.componentFolder, block.asset)
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
