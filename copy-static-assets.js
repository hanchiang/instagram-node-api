// Copy non js files into dist/

const shell = require('shelljs');

shell.cp('-R', './src/commands/scrape/input', './dist/commands/scrape/input');
