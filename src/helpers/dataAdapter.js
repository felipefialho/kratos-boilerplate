const yaml = require('js-yaml');
const fs = require('fs');
const getExtension = function (filePath) {
  const matches = filePath.match(/(?:\w+\.)+(\w+)/);
  return matches && matches[1];
};

const Strategies = {
  yaml: (filePath) => yaml.safeLoad(fs.readFileSync(filePath, 'utf-8')),
  json: (filePath) => require('../../' + filePath)
};

module.exports = (filePath) => {
  if (typeof filePath === 'string') {
    switch (getExtension(filePath)) {
    case 'yml':
    case 'yaml':
      return Strategies.yaml(filePath);
    case 'json':
      return Strategies.json(filePath);
    }
  }
};