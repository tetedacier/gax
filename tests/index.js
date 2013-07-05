
var fsParser = require('../index.js')//gax
  , fs = require('fs')
  , assert = require('assert')
  , requirement = {
    urlCheck: {
      relativePathPattern : '*.css'
      , urlRegExp : '(\\s+|:)url\\s*((\\(("(?<resourceUrlA>[^"]+)"|\'(?<resourceUrlB>[^\']+)\'|(?<resourceUrlC>[^)]+))\\))|("(?<resourceUrlD>[^"]+)")|(\'(?<resourceUrlE>[^\']+)\'))'
      , parserCallBack : function(result){
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
        }
      , finalCallBack : function (){
        try {
          assert(editorProcessResult === attendedEditorProcessResult, 'all attend url match are not found');
        } catch(e) {
          console.warn(e);
        }
        console.log('ok in ' + ((new Date()) - start) + 'ms');
      }
    }
  }
  , cssParser = new fsParser('./assets')
  , editorProcessResult = ''
  , concatenateParserOutput = function (lineMatch) {
    editorProcessResult += lineMatch + "\n";
  }
;

for (var i in requirement) {
  editorProcessResult = '';
  processAttended(
    i,
    requirement[i]
  );
}
function processAttended(requirementName, requirement){

  fs.readFile("tests/" + requirementName + ".attended-result",function(err, data){
      if (err) {
        throw(err);
      }
      attendedEditorProcessResult = data.toString();
      cssParser.process(
        requirement.relativePathPattern,
        requirement.urlRegExp,
        requirement.parserCallBack,
        requirement.finalCallBack
      );

  });

}
var start = new Date();
