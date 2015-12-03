#!/usr/bin/env node
var program = require('commander');
var cloudman = require('cloudman-api');
var cred = require('./cred');
var _ = require('lodash');
var Table = require('cli-table');
var globals = require('./globals');

program
    .option('-i, --id [value]', 'instance to start')
    .option('-a, --account [value]', 'account that holds the instance with given id')
    .option('-y --yes', 'bypass confirmation')
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

var question = 'Are you sure you want to start the instance with id _i in account _a? <y/n>'
    .replace('_i', program.id)
    .replace('_a', program.account);

//if -y is passed, execute the action, ask for confirmation otherwise.
if(program.yes) executeAction()
else globals.askForConfirmation(question, executeAction);


function executeAction(){
    cloudman.init(cred);
    var response = [];

    var instance = [{
        keyName: keyName[0],
        instanceId: program.id
    }];

    cloudman.start(instance).then(function(json){
        var mockupSentence = 'start action could _processed_ be performed in instance with id _id_. _err_';
        var response = globals.parseActionRequest(json, mockupSentence);
        console.log(response.join('\n'));
    }).catch(globals.handleError);


};
