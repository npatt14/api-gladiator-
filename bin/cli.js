/* API Gladiator - CLI Entry Point
 * 
 * This is the main entry point for the api gladiator cli.
 * -> sets up the command structure, handles command registration, and provides
 * the primary user interface for the application.
 * 
 */


import { program } from 'commander'; // obj from commander - assists in building CLIs
import chalk from 'chalk';
import figlet from 'figlet';
// fetch curr app version
import { version } from '../package.json';

// display banner
console.log(
    chalk.blue(
        figlet.textSync('api gladiator', { horizontalLayout: 'full' })
    )
);
console.log(chalk.yellow(`A battling ground for APIs -v${version}\n`));


// register commands
import registerCommands from '../src/commands/register.js';
import testCommands from '../src/commands/test.js';
import compareCommands from '../src/commands/compare.js';
import resultsCommands from '../src/commands/results.js';

registerCommands(program);
testCommands(program);
compareCommands(program);
resultsCommands(program);

// add global options
program
    .version(version)
    .option('-v, --verbose', 'Enable verbose output')
    .option('--profile <profile>', 'Use a specific AWS profile');

program.on('command:*', () => {
    console.error(chalk.red(`\nInvalid command: ${program.args.join(' ')}`));
    console.log(chalk.white(`See --help for a list of available commands. \n`));
    process.exit(1);
});

program.parse(process.argv);

// if no args, show help
if (process.argv.length === 2) {
    program.help();
}
