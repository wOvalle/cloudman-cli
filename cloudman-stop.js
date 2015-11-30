#!/usr/bin/env node
var program = require('commander');
var cloudman = require('cloudman-api');
var cred = require('./cred');
var _ = require('lodash');
var Table = require('cli-table');

program
    .option('-i, --id [value]', 'instance to stop')
    .option('-a, --account [value]', 'account that holds the instance with given id')
    .parse(process.argv);

if(!program.id){
    console.log('id parameter is required.');
    process.exit(1);
}

if(!program.account){
    console.log('account parameter is required.');
    process.exit(1);
}

//by default, include every keyName in cred.js
var keyName = cred.map(function(item){
    return item.keyName;
}).filter(function(item){
    if(item) item = item.toLowerCase();
    return item === program.account.toLowerCase();
});

if(!keyName || keyName.length === 0) {
    console.log('Invalid account. Are you sure that account %s is described in cred.js?', program.account);
    process.exit(1);
}

cloudman.init(cred);
var response = [];

var instance = [{
    keyName: keyName[0],
    instanceId: program.id
}];

cloudman.stop(instance).then(function(json){
    var mockupSentence = 'stop action could _processed_ be performed in instance with id _id_. _err_';
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
}).catch(function(err){console.log(err)});
