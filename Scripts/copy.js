
var
  util = require("util"),
  fs = require('fs'),
  cp = require('glob-copy'),
  glob = require("glob");



console.warn('args: ' + process.argv);
console.warn('now creating a tmp sub folder');
var folderName = util.format("tmp_%s_%s", process.argv[2], new Date().getTime());
fs.mkdirSync(folderName);
console.warn('tmp folder ' + folderName + ' created');
console.warn('copy all apis in the subfolder');
cp.sync('./apis/**/*.yaml', "./" + folderName);
console.warn('now copy relevant products, if any');
glob("./products/*.yaml", null, function (er, files) {
  for(var f in files){
    //var fileName = files[f].split("/")[files[f].split("/").length-1];
    var fileName = files[f];
    if(searchFor(process.argv,fileName)){
      console.warn('Copying changed product ' + fileName + ' across the tmp folder');
      cp.sync(files[f], folderName);
    }
  }
});

var searchFor = function(arr, str){
  
  for(element in arr){
    if(arr[element].indexOf(str)>-1){
      return true;
  }
  }
  return false;
}
