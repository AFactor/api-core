var fs = require('fs'),
glob = require("glob"),
swagger = require('swagger-parser'),
path = require('path');

var apiFolder = "./apis";

function getDirectories(folderName){
    return fs.readdirSync(folderName).filter(function(file){
        return fs.statSync(path.join(folderName, file)).isDirectory()
    })
}

function ChangeProperty(object, name, value){
    if(object.hasOwnProperty(name) ){
    	object[name] = value;
    	return 1;
    }
        

    for(var i=0;i<Object.keys(object).length;i++){
        if(typeof object[Object.keys(object)[i]]=="object"){
            o=ChangeProperty(object[Object.keys(object)[i]],name, value);
            if(o==1)
                return o;
        }
    }

    return null;
}

var dirs = getDirectories(apiFolder);

for (var d in dirs) {
    var dirPath = apiFolder + "/" + dirs[d];
    //console.log('dirpath ' + dirPath);
    if(fs.existsSync(dirPath + "/properties.json")){
        var apiFileName = glob.sync(dirPath + "/*.yaml")[0];
        
        
        swagger.validate(apiFileName, function(err, nativeObject) {
            if(err){
                console.log('Validation of Swagger failed: ' + apiFileName);
            }
            console.log ('API File Name' + apiFileName);
            var configFileName = path.dirname(apiFileName) + "//properties.json" ;
            console.log(configFileName);
            var config = JSON.parse(fs.readFileSync(configFileName, "UTF8" ));
            //console.log(JSON.stringify(nativeObject.swagger));
            if(nativeObject.swagger){
                console.log('API name : ' + nativeObject.info["x-ibm-name"]);
                var apiChanged = false;
                console.log(JSON.stringify(config)); 
                for(var c in config){
                       
                    if(ChangeProperty(nativeObject, config[c]["key"], config[c]["value"])){
                        console.log('property ' + config[c]["key"] + " changed");
                        apiChanged = true;
                    }
                    else
                        console.log('Key ' + config[c]["key"] + ' not found in API ' +   nativeObject.info["x-ibm-name"] );
                }
                //writting back if changed
                if(apiChanged){
                    var yamlString = yaml.stringify(nativeObject, 4);
                    fs.writeFileSync(apiFileName, yamlString, 'utf8');
                    console.log('API ' + nativeObject.info["x-ibm-name"] + " is modified and written back in " + apiFileName );
                }
            }

        });
        
        
    }
}
 