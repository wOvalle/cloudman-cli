#!/usr/bin/env node

var program = require('commander');

program
    .version('0.0.1')
    .command('status', 'print status of instances')
    .command('stop', 'stop instances')
    .parse(process.argv);

if (!program.args.length) program.help();
