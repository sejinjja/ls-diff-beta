#!/usr/bin/env node

const { Command } = require('commander');
const path = require('path');
const runDiff = require('../lib/diff');

const program = new Command();

program
  .requiredOption('-t, --target <dir>', 'Target directory')
  .option('--ti <include>', 'Target include glob pattern')
  .option('--te <exclude>', 'Target exclude glob pattern')
  .requiredOption('-o, --other <dir>', 'Other directory')
  .option('--oi <include>', 'Other include glob pattern')
  .option('--oe <exclude>', 'Other exclude glob pattern')
  .option('-l', 'Compare file names (default)')
  .option('-d', 'Compare file contents');

program.parse(process.argv);
const opts = program.opts();

const compareName = opts.l || !opts.d;

const compareContent = opts.d;

runDiff({
  target: {
    dir: path.resolve(opts.target),
    include: opts.ti,
    exclude: opts.te
  },
  other: {
    dir: path.resolve(opts.other),
    include: opts.oi,
    exclude: opts.oe
  },
  compareName,
  compareContent
});
