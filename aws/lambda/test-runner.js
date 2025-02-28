/**
 * api gladiator test runner - lambda
 * Executes performance tests against APIs
 */

import axios from "axios";
import { performance } from "perf_hooks";

function calculatePercentile(sortedArray, percentile) {
  if (sortedArray.length === 0) return 0;
  const index = Math.ceil((percentile / 100) * sortedArray.length) - 1;
  return sortedArray[Math.max(0, Math.min(sortedArray.length - 1, index))];
}

/**
 * Execute a single test request
 * @param {string} url - API url to test
 * @param {Object} headers - Request headers
 * @returns {Promise<Object>} - Test result for single request
 */
async function executeTestRequest(url, headers = {}) {
  const startTime = performance.now();
  let status = 0;
  let size = 0;
  let error = null;

  try {
    const response = await axios.get(url, {
      headers,
      timeout: 30000,
      validateStatus: () => true, //accept any status code
    });

    status = response.status;
    //calculate approximate size of response
    size = JSON.stringify(response.data).length;
  } catch (err) {
    error = err.message;
  }

  const endTime = performance.now();
  const latency = endTime - startTime;

  return {
    timestamp: new Date().toISOString(),
    latency,
    status,
    size,
    error,
    success: !error && status >= 200 && status < 500,
  };
}

/**
 * Run a performance test against an API
 * @param {Object} event - Lambda event
 * @param {Object} context - Lambda context
 * @returns {Promise<Object>} - Test results
 */
export const handler = async (event, context) => {
    const { api, config } = event;
  
    // extract test parameters
    const { type = 'latency', duration = 10, concurrency = 10, delay = 0 } = config;
    
    console.log(`Running ${type} test on ${api.url} for ${duration}s with concurrency ${concurrency}`);
  
    // prep headers
    const headers = {};
    if (api.authHeader) {
      headers['Authorization'] = api.authHeader;
    }
  
    const results = [];
    const startTime = performance.now();
    const endTime = startTime + (duration * 1000);
  
    // execute test requests
    while (performance.now() < endTime) {
      const requestPromises = [];
      
      for (let i = 0; i < concurrency; i++) {
        requestPromises.push(executeTestRequest(api.url, headers));
        
        // add delay if specified
        if (delay > 0) {
          await new Promise(resolve => setTimeout(resolve, delay));
        }
      }
      
      const requestResults = await Promise.all(requestPromises);
      results.push(...requestResults);
    }
  
    // CALUCLATE METRICS :D
    const totalTime = performance.now() - startTime;
    const latencies = results.map(r => r.latency).sort((a, b) => a - b);
    const sizes = results.map(r => r.size);
    const successfulRequests = results.filter(r => r.success).length;
    
    return {
      totalRequests: results.length,
      successfulRequests,
      failedRequests: results.length - successfulRequests,
      totalTime,
      averageLatency: latencies.reduce((sum, val) => sum + val, 0) / latencies.length,
      minLatency: latencies[0] || 0,
      maxLatency: latencies[latencies.length - 1] || 0,
      p50Latency: calculatePercentile(latencies, 50),
      p95Latency: calculatePercentile(latencies, 95),
      p99Latency: calculatePercentile(latencies, 99),
      requestsPerSecond: (results.length / totalTime) * 1000,
      bytesTransferred: sizes.reduce((sum, val) => sum + val, 0),
      // include raw results for detailed analysis
      rawResults: results
    };
  };