var fsParser = require('../index.js');
var fs = require('fs');
var
  urlRegExp = '(\\s+|:)url\\s*((\\(("(?<resourceUrlA>[^"]+)"|\'(?<resourceUrlB>[^\']+)\'|(?<resourceUrlC>[^)]+))\\))|("(?<resourceUrlD>[^"]+)")|(\'(?<resourceUrlE>[^\']+)\'))'
  , cssParser = new fsParser('./assets')
  , consoleWarn = function (str){

  }
;
function concatenateParserOutput(lineMatch) {
  editorProcessResult += lineMatch + "/n";
}
var editorProcessResult = "";
var attendedEditorProcessResult = fs.readFileSync("./tests/editor.css-result");
cssParser.process(
  '*.css',
  urlRegExp,
  function parserCallBack(result){
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
    assert.deepEqual(editorProcessResult, attendedEditorProcessResult, 'all url are not found');
  }
);
