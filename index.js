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

  function nbLineBeforeOffset(data, offset) {
    var nbLineMatched = data.substr(0, offset-1).match(/\n/g);
    if (null !== nbLineMatched) {
      return nbLineMatched.length + 1;
    }
    else{
      //if no new line is matched in the string, it means that the match occurs on the first line
      return 1;
    }
  }
  function Pattern(primitive){
    var reCollection = [];
    this.match = function(){

    };
    if(typeof primitive === "string"){
      var patternCollection = primitive.split(',');
    }
    else{
      var patternCollection = primitive;
    }
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
  this.process = function(filePattern, process, callback, finalCallBack){
    processPathComponent('',filePattern, process, callback, function(){
      finalCallBack();
    });
  };
};
