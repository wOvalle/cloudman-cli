#!/usr/bin/env node
var program = require('commander');
var cloudman = require('cloudman-api');
var cred = require('./cred');
var _ = require('lodash');
var Table = require('cli-table');

program
    .option('-a, --accounts [value]', 'accounts to include (comma separated), returns all the accounts by default')
    .parse(process.argv);

cloudman.init(cred);

//by default, include every keyName in cred.js
var keyNames = cred.map(function(item){
    return item.keyName;
});

if(program.accounts){
    var accounts = program.accounts.split(',');

    keyNames = keyNames.filter(function(f){
        return accounts.indexOf(f) > -1;
    });
}

cloudman.status(keyNames).then(prettyPrintInstances);

function prettyPrintInstances(res){
    json = res.map(function(item){
        return {
            id: item.id,
            arch: item.architecture,
            type: item.type,
            zone: item.zone,
            state: item.state,
            provider: item.cloudProvider.provider
        };
    });

    var headers = [], data = [], line = [];
    _.each(json, function(j,i){
        line = [];
        _.forOwn(j, function(val, key){
            if(i === 0) headers.push(key);
            line.push(val);
        });
        data.push(line);
    });

    var table = new Table({head: headers});
    _.each(data, function(data){table.push(data)});
    console.log(table.toString());
}