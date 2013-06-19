var
  xRegExp = require('xregexp').XRegExp,
  fs=require('fs')
;
module.exports = function (rootPath){
  var parserDir;
  if(fs.existsSync(rootPath)){
      parserDir = rootPath;
  }
  else{
    throw("'"+rootPath+"' path does not exists");
  }


  function replaceAll(subject, pattern, replacement) {
    var previousSubjectReplacement = subject;//code
    var subjectReplacement = subject.replace(pattern, replacement);
    while (previousSubjectReplacement !== subjectReplacement) {
      previousSubjectReplacement = subjectReplacement;
      subjectReplacement = subjectReplacement.replace(pattern, replacement);
    }
    return subjectReplacement;
  }
  function nbLineBeforeOffset(data, offset) {
    return data.substr(0, offset-1).match(/\n/g).length + 1;
  }
  function processFile(relativePath, filePattern, process, callback){
    var
      rawData = '',
      match,
      realOffset = 0;
    ;
    if (
        null !== (parserDir + ((relativePath !== "")?'/':'') + relativePath).match(
          new RegExp(
            filePattern
              .replace(/\*/,'.*')
              .replace(/\?/,'.?')
            + "$"
          )
        )
    ){
      fs.readFile(parserDir + ((relativePath !== "")?'/':'') + relativePath, function(err, data){
        if (err) {
          throw(
            "cannot read file '"
            + parserDir + ((relativePath !== "")?'/':'') + relativePath
            + "'");
        }
        else{
          rawData = data = data.toString();
          match = xRegExp.exec(rawData, new xRegExp(process));
          while (null !== match) {
            realOffset += match.index + match[0].length;
            rawData = data.substr(realOffset);
            callback({name: relativePath, matches: match, line: nbLineBeforeOffset(data, realOffset)});
            match = xRegExp.exec(rawData, new xRegExp(process));
          }
        }
      });
    }
  };
  function processPath (relativePath, filePattern, process, callback){
    //console.log("processPath '" + relativePath + "'");
    fs.readdir(parserDir + ((relativePath !== "")?'/':'') + relativePath, function processPath(err, files){
      for (var i = 0, l = files.length; i < l; i++) {
        processPathComponent(relativePath + files[i], filePattern, process, callback);
      }
    });
  };
  function processPathComponent(relativePath, filePattern, process, callback) {
    fs.stat(parserDir + (("" !== relativePath)?'/':'') + relativePath, function(err, stats){
      if (err) {
        callback({});
      }else{
        //console.warn("processPathComponent '" + relativePath +"' isDirectory : " + stats.isDirectory());
        if(stats.isDirectory()){
          processPath(("" !== relativePath)?relativePath.replace(/([^/])$/,'$1/'):'', filePattern, process, callback);
        }else{
          if(stats.isFile()){
            processFile(relativePath, filePattern, process, callback);
          }else{
            //WTF ?
          }
        }
      }
    });
  }
  this.process = function(filePattern, process, callback){
    processPathComponent('',filePattern, process, callback);
  };
};
