var fsParser = require('./index.js');

var urlRegExp = '(\\s+|:)url\\s*((\\(("(?<resourceUrlA>[^"]+)"|\'(?<resourceUrlB>[^\']+)\'|(?<resourceUrlC>[^)]+))\\))|("(?<resourceUrlD>[^"]+)")|(\'(?<resourceUrlE>[^\']+)\'))';
var cssParser = new fsParser('./assets');
cssParser.process(
  '*.css',
  urlRegExp,
  function parserCallBack(result){
    console.warn(
      "'" + result.name + "' contains url definition "
      + (
        result.matches.resourceUrlA
        || result.matches.resourceUrlB
        || result.matches.resourceUrlC
        || result.matches.resourceUrlD
        || result.matches.resourceUrlE
      )
      + " at line " + result.line);
  }
);
