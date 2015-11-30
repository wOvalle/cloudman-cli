#!/usr/bin/env node
var program = require('commander');
var cloudman = require('cloudman-api');
var cred = require('./cred');
var _ = require('lodash');
var Table = require('cli-table');

program
    .option('-t, --type [value]', 'type of instance to create. See validTypes in cloudman-api/providers')
    .option('-i, --image [value]', 'valid image id in the provider you selected')
    .option('-a, --account [value]', 'account in which the instance will be created')
    .option('-n, --name [value]', 'name of instance (only required by digital ocean)')
    .option('-r, --region [value]', 'region in which the instance will be created (should be a valid region of the provider)')
    .parse(process.argv);