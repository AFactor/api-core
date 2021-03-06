var fs = require('fs'),
util =require('util'),
cp = require('glob-copy'),
glob = require("glob");
cmd = require('node-cmd');


//load env varibales
fs.readFile(process.argv[3], 'utf8', function(err, config){

    var configJson = JSON.parse(config);
    var login = util.format('yes |apic login -u %s -p %s -s %s', configJson.userName, configJson.password, configJson.server);
    //login
    cmd.get(login, function (err, data, stderr) {
        //read yamls
        
        glob("./tmp*/*.yaml", null, function (er, files) {
            var pushArray = [];
            for (var f in files) {
                var productFile =fs.readFileSync(files[f], 'utf8');
                
                console.warn('product file ' + files[f]);
                //if they are products, publish
                if(productFile.indexOf("product: \"1.0.0\"")>-1 || productFile.indexOf("product: 1.0.0")>-1 || productFile.indexOf("product: '1.0.0'")>-1){
                    
                    var singlePush = util.format('yes |apic publish %s  -c %s -o %s -s %s' ,  
                    files[f] , configJson.catalogue, configJson.org, configJson.server);
                     pushArray.push (singlePush);
                }
            }
            if(pushArray.length >0){
                var pushCommand = pushArray.join(' & ');
                console.warn('Push command : ' + pushCommand);
                cmd.get(pushCommand, function(err, data, staderr){
                    console.warn(data);
                    var logout = util.format('yes |apic logout -s %s', configJson.server);
                    cmd.get(logout, function(err, data, staderr){
                        console.warn(data)
                    });
                });
            } else {
                console.warn('No products to publish in this build');
                var logout = util.format('yes |apic logout -s %s', configJson.server);
                    cmd.get(logout, function(err, data, staderr){
                        console.warn(data)
                    });
            }
                 
            
        });
     });
});

