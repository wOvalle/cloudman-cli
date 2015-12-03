#!/usr/bin/env node
var program = require('commander');
var cloudman = require('cloudman-api');
var cred = require('./cred');
var _ = require('lodash');
var Table = require('cli-table');

program
    .option('-t, --type [value]', 'type of instance to create. See validTypes in cloudman-api/providers')
    .option('-i, --image [value]', 'valid image id in the provider you selected')
    .option('-a, --account [value]', 'account in which the instance will be created (keyName in cred.js')
    .option('-n, --name [value]', 'name of instance (only required by digital ocean)')
    .option('-r, --region [value]', 'region in which the instance will be created (should be a valid region of the provider)')
    .parse(process.argv);

if(!program.type){
    console.log('type parameter is required.');
    process.exit(1);
};

if(!program.image){
    console.log('image parameter is required.');
    process.exit(1);
};

if(!program.account){
    console.log('account parameter is required.');
    process.exit(1);
};

if(!program.region){
    console.log('region parameter is required.');
    process.exit(1);
};

var keyName = cred.map(function(item){
    return item.keyName;
}).filter(function(item){
    if(item) item = item.toLowerCase();
    return item === program.account.toLowerCase();
});

if(!keyName || keyName.length === 0) {
    console.log('Invalid account. Are you sure that account "%s" is described in cred.js?', program.account);
    process.exit(1);
};

var provider = cred.filter(function(item){
    return item.keyName === program.account.toLowerCase()
}).map(function(item){
    return item.provider;
});

/*go find dispositions*/
cloudman.init(cred);

cloudman.validDispositions().then(function(disp){
    if (!_.get(disp, provider)) {
        return console.log('Invalid data. Provider is not within dispositions.');
    }

    //validate type
    var validTypes = disp[provider].type.map(function(val){return val.id});
    if(validTypes.indexOf(program.type) === -1) {
        return console.log('Instance type (%s) is invalid for provider %s.', program.type, provider);
    };

    //validate region
    var validRegions = disp[provider].region.map(function(val){return val.id});
    if(validRegions.indexOf(program.region) === -1) {
        return console.log('Region (%s) is invalid for provider %s.', program.region, provider);
    };

    //validate images
    var validImages = disp[provider].image.map(function(val){return val.id});
    if(validImages.indexOf(program.image) === -1) {
        return console.log('Image (%s) is invalid for provider %s.', program.image, provider);
    };

    var objToCreate = [{
        properties: {
            type: program.type,
            region: program.region,
            image: program.image,
            name: 'cloudman ' + (new Date()).getTime(),
        },
        keyName: keyName[0]
    }];

    cloudman.init(cred);

    var response = [];
    cloudman.create(objToCreate)
        .then(function(json){
            var mockupSentence = 'Create action could _processed_ be performed. New Instance id: _id_. _err_';
            _.each(json, function(j){
                var currSentence = mockupSentence;
                if(j.actionProcessed)
                {
                    currSentence = currSentence
                        .replace('_processed_ ', '')
                        .replace('_id_', j.input)
                        .replace(' _err_', '');
                }
                else {
                    currSentence = currSentence
                        .replace('_processed_', 'not')
                        .replace('_id_', j.input)
                        .replace('_err_', 'Err: ' + j.errMessage);
                }

                response.push(currSentence);
            });

            console.log(response.join('\n'));
        })
        .catch(handleError);
}).catch(handleError);

var handleError = function(err){
    //do logging in here
    console.log(err, err.stack);
};

