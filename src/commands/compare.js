/**
 * Compare performances between multiple APIs
 */

export default function(program) {
    program 
        .command('compare')
        .description('Compare performance between APIs')
        .requiredOption('--api-id <id>', 'ID of the first API')
        .requiredOption('--versus <id>', 'ID of the API to compare against')
        .option('--type <type>', 'Test type (latency, throughput, errors, all)', 'all')
        ,action(async (options) => {
            console.log(`Comparing API ${options.apiId} against ${options.versus}`);
            console.log('This feature is under development! Check back soon :p');
        });
}