var fsParser = require('../index.js')
  , fs = require('fs')
  , assert = require('assert')
  , editorProcessResult = ''
  , attendedEditorProcessResult = fs.readFileSync("tests/urlCheck.attended-result").toString()
  , urlRegExp = '(\\s+|:)url\\s*((\\(("(?<resourceUrlA>[^"]+)"|\'(?<resourceUrlB>[^\']+)\'|(?<resourceUrlC>[^)]+))\\))|("(?<resourceUrlD>[^"]+)")|(\'(?<resourceUrlE>[^\']+)\'))'
  , cssParser = new fsParser('./assets')
  , consoleWarn = function (str){
    console.warn(str);
  }
;
function concatenateParserOutput(lineMatch) {
  editorProcessResult += lineMatch + "\n";
}
console.log("checking if all url are matched inside css files ");
var start = new Date();
cssParser.process(
  '*.css',
  urlRegExp,
  function parserCallBack(result){
    console.log('.');
    concatenateParserOutput(
      "'" + result.name + "' contains url definition "
      + (
        result.matches.resourceUrlA
        || result.matches.resourceUrlB
        || result.matches.resourceUrlC
        || result.matches.resourceUrlD
        || result.matches.resourceUrlE
      )
      + " at line " + result.line
    );
  },
  function finalCallBack(){
    try {
      assert(editorProcessResult === attendedEditorProcessResult, 'all attend url match are not found');
    } catch(e) {
      console.warn(e);
    }
    console.log('ok in ' + ((new Date()) - start) + 'ms');

  }
);
