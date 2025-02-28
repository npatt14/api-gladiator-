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
        .action(async (options) => {
            const spinner = ora(`Preparing ${options.type} test...`).start();

            try {
                // convert options to correct types
                const testConfig = {
                    apiId: options.apiId,
                    type: options.type, 
                    duration: parseInt(options.duration, 10), 
                    concurrency: parseInt(options.concurrency, 10),
                    delay: (parseInt(options.delay, 10))
                };

                // validate options
                if (isNaN(testConfig.duration) || testConfig.duration <= 0) {
                    throw new Error('Duration must be a positive number');
                }
                if (isNaN(testConfig.concurrency) || testConfig.concurrency <= 0) {
                    throw new Error('Concurrency must be a positive number');
                  }
                if (isNaN(testConfig.delay) || testConfig.delay < 0) {
                    throw new Error('Delay must be a non-negative number');
                  }

                  spinner.text = 'Fetching API details...';

                  // would normally fetch from DynamoDB
                  // const api = await apiService.getApi(testConfig.apiId);

                  // for now, mock data :D
                  const api = {
                    id: testConfig.apiId,
                    url: 'https://example.com/api',
                    name: `Test API ${testConfig.apiId}`,
                    authHeader: null
                  };

                  spinner.text = `Running ${options.type} test against ${api.name}...`;

                  // this would normally invoke a lambda
                  // const testResult = await testService.runTest(api, testConfig);

                  // mock test results :p
                  const testResult = {
                    id = `test-${Date.now()}`, 
                    apiId: api.id, 
                    type: testConfig.type, 
                    timestamp: new Date().toISOString(),
                    duration: testConfig.duration,
                    results: {
                        totalRequests: 100,
                        successfulRequests: 98,
                        failedRequests: 2,
                        totalTime: testConfig.duration * 1000,
                        averageLatency: 42.5,
                        minLatency: 12.3,
                        maxLatency: 215.6,
                        p50Latency: 38.2,
                        p95Latency: 95.1,
                        p99Latency: 180.3,
                        requestsPerSecond: 10,
                        bytesTransferred: 256000,
                    }
                  };

                  // display results
                  spinner.succeed(`Test completed successfully`);
                  console.log('');
                  console.log(chalk.green('Test Results:'));
                  console.log(chalk.white(`Test ID: ${chalk.cyan(testResult.id)}`));
                  console.log(chalk.white(`API: ${chalk.cyan(api.name)} (${api.id})`));
                  console.log(chalk.white(`Type: ${chalk.cyan(testResult.type)}`));
                  console.log(chalk.white(`Duration: ${chalk.cyan(testResult.duration)} seconds`));
                  console.log('');
                  console.log(chalk.yellow('Performance Metrics:'));
                  console.log(chalk.white(`  Total Requests: ${chalk.cyan(testResult.results.totalRequests)}`));
                  console.log(chalk.white(`  Success Rate: ${chalk.cyan((testResult.results.successfulRequests / testResult.results.totalRequests * 100).toFixed(1))}%`));
                  console.log(chalk.white(`  Avg Latency: ${chalk.cyan(testResult.results.averageLatency.toFixed(2))} ms`));
                  console.log(chalk.white(`  Min Latency: ${chalk.cyan(testResult.results.minLatency.toFixed(2))} ms`));
                  console.log(chalk.white(`  Max Latency: ${chalk.cyan(testResult.results.maxLatency.toFixed(2))} ms`));
                  console.log(chalk.white(`  P95 Latency: ${chalk.cyan(testResult.results.p95Latency.toFixed(2))} ms`));
                  console.log(chalk.white(`  Requests/sec: ${chalk.cyan(testResult.results.requestsPerSecond.toFixed(2))}`));
                  console.log('');
                  console.log(chalk.yellow('Next steps:'));
                  console.log(chalk.white(`  View detailed results: ${chalk.cyan(`apigladiator results --test-id ${testResult.id}`)}`));
                  console.log(chalk.white(`  Compare with another API: ${chalk.cyan(`apigladiator compare --api-id ${api.id} --versus ANOTHER_API_ID`)}`));
            }
        })

}