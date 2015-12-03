#!/usr/bin/env node

var program = require('commander');

program
    .version('0.0.1')
    .command('status', 'print status of instances')
    .command('stop', 'stop instances')
    .command('start', 'start instances')
    .command('terminate', 'delete instances')
    .command('create', 'create instances')
    .description('cloudman-cli. Command Line Interface client of cloudman-api.')
    .parse(process.argv);

if (!program.args.length) program.help();
