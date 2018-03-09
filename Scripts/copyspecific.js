var util = require("util"),
  fs = require('fs'),
  cp = require('glob-copy'),
  glob = require("glob");
  yaml = require("js-yaml");



console.warn('args: ' + process.argv);
console.warn('now creating a tmp sub folder');
var folderName = util.format("tmp_%s_%s", process.argv[2], new Date().getTime());
fs.mkdirSync(folderName);
console.warn('tmp folder ' + folderName + ' created');
var apiNames =[];
console.warn('Copy product file');
var productFileName = "./products/" + process.argv[3];
cp.sync(productFileName, folderName);
var product = yaml.safeLoad(fs.readFileSync(productFileName, 'utf8'));
for(var i=0;i<Object.values(product.apis).length;i++){
   var api  = Object.values(product.apis)[i].$ref;
   cp.sync('./apis/**/' +api, folderName);
  }



