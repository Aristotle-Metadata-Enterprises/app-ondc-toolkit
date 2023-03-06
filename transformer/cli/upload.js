const { Command } = require('commander');
const program = new Command();

const extract = require("../utils/extract");
const aristotle = require("../utils/aristotle");


program
  .name('ondc')
  .description('CLI to do ONDC stuff')
  .version('0.8.0');

program.command('split')
  .description('Split a string into substrings and display as an array')
  .argument('<string>', 'string to split')
  .option('--first', 'display just the first substring')
  .option('-s, --separator <char>', 'separator character', ',')
  .action((str, options) => {
    const limit = options.first ? 1 : undefined;
    console.log(str.split(options.separator, limit));
  });

program.command('extract')
  .description('extract from document')
  .argument('<file>', 'file to extract from')
  .option('-s, --separator <char>', 'separator character', ',')
  .action((file, options) => {
    extract.parse(file, options)
  });

  program.command('aristotle')
  .description('extract from document')
  .argument('<file>', 'file to extract from')
  .action((file, options) => {
    aristotle.convert(file, options)
  });

program.parse();
