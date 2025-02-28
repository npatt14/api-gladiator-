/**
 * Registers Command
 * Handles API registration for testing
 */

import chalk from 'chalk';
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';
import ora from 'ora';
import apiService from '../services/api-sevice.js'

export default function(program) {
    program
        .command('register')
        .description('Register an API for battle')
        .requiredOption('--api <url', 'API endpoint URL')
        .option('--name <name>', 'Friendly name for the API')
        .option('--auth-header <header>', 'Authorization header if required')
        .option('--category <category>', 'API category (REST, GraphQL, etc.)', 'REST')
        .option('--description <text>', 'Description of the API')
        .action(async (options) => {
            const spinner = ora('Validating API endpoint...').start();

            try {
                // validate that the endpoint is reachable
                try {
                    const headers = {};
                    if (options.authHeader) {
                        headers['Authorization'] = options.authHeader;
                    }

                    await axios.get(options.api, {
                        headers,
                        timeout: 5000,
                        valudateStatus: () => true
                    });

                    spinner.succeed('API endpoint is reachable');
                } catch (error) {
                    spinner.warn('API endpoint validation failed, but continuing with registration');
                    console.log(chalk.yellow(`Reason ${error.message || 'Unknown error'}`));

                }

                const apiId = uuidv4();
                const apiData = {
                    id: apiId,
                    url: options.api,
                    name: options.name || `API-${apiId.substring(0, 8)}`,
                    category: options.description || '',
                    authHeader: options.authHeader || null,
                    registeredAt: new Date().toISOString(),
                    // add more fields later as needed
                };

                spinner.text = 'Registering API...';

                // this would normally save to dynamoDB, but for now we'll mock it
                // await apiService.registerApi(apiData);

                console.log('') // spacing
                console.log(chalk.green('✓ API registered successfully'));
                console.log(chalk.white(`ID: ${chalk.cyan(apiData.id)}`));
                console.log(chalk.white(`Name: ${chalk.cyan(apiData.id)}`));
                console.log(chalk.white(`Endpoint: ${chalk.cyan(apiData.url)}`));
                console.log(''); 
                console.log(chalk.yellow('Next Steps:'));
                console.log(chalk.white(` Run a test: ${chalk.cyan(`apigladiator test --api-id ${apiData.id} --type latency`)}`));  
            } catch (error) {
                spinner.fail('API registration failed');
                console.error(chalk.red(`Error: ${error.message || 'Unknown error'}`));
                process.exit(1);
            }
        });
}