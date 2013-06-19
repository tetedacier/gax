var fsParser = require('./index.js');

var parserPath = './assets';
var urlRegExp = '(\\s+|:)url\\s*((\\(("(?<resourceUrlA>[^"]+)"|\'(?<resourceUrlB>[^\']+)\'|(?<resourceUrlC>[^)]+))\\))|("(?<resourceUrlD>[^"]+)")|(\'(?<resourceUrlE>[^\']+)\'))';

(new fsParser(parserPath)).process(
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
/*
(new fsParser('/Users/fabien/Projects/node/fullStackParser/web')).process(
  '*.css',
  '(\\s+|:)url\\s*(\\(("(?<resourceUrl>[^"]+)"|\'(?<resourceUrl>[^\']+)\'|(?<resourceUrl>[^)]+))\\)|"(?<resourceUrl>[^"]+)"|\'(?<resourceUrl>[^\']+)\')',
  parserCallBack
);
*/
/*
(new fsParser('/Users/fabien/Projects/node/fullStacarser/web')).process(
  '*.css',
  '(\\s+|:)url\\s*(\\(("(?<resourceUrl>[^"]+)"|\'(?<resourceUrl>[^\']+)\'|(?<resourceUrl>[^)]+))\\)|"(?<resourceUrl>[^"]+)"|\'(?<resourceUrl>[^\']+)\')',
  parserCallBack
);
*/
