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
  block.path = block.asset.substring(0, block.asset.lastIndexOf('/'));
  block.file = block.asset.substring(block.asset.lastIndexOf('/') + 1);

  if (this.options.htmlComponentFolder || this.options.cssComponentFolder) {
    componentFolder = this.options[blockExt.substr(1) + 'ComponentFolder'];
  }

  if (componentFolder && (utils.exists(path.join(componentFolder, block.asset)) || utils.exists(path.join(componentFolder, path.join(block.path, '_' + block.file))))) {
      assetPath = utils.exists(path.join(componentFolder, path.join(block.path, '_' + block.file))) ? path.join(componentFolder, path.join(block.path, '_' + block.file)) : path.join(componentFolder, block.asset);
  } else {
      assetPath = utils.exists(path.join(path.dirname(filePath), path.join(block.path, '_' + block.file))) ? path.join(path.dirname(filePath), path.join(block.path, '_' + block.file)) : path.join(path.dirname(filePath), block.asset);
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
