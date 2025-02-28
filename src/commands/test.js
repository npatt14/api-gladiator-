/**
 * Test command 
 * Execute performance tests against registered APIs
 */

import chalk from 'chalk';
import ora from 'ora';
import testService from '../services/test-service';

export default function(program) {
    program
        .command('test')
        .description('Run performance tests on API')
        .requiredOption('--api-id <id>', 'ID of the registered API')
        .requiredOption('--type <type>', 'Test type (latency, throughput, errors)', 'latency')
        .option('--duration <seconds>', 'Test duration in seconds', '10')
        .option('--concurrency <number>', 'Concurrent requests', '10')
        .option('--delay <ms>', 'Delay between requests in ms', '0')

}