/**
 * AWS config
 * This module handles all AWS SDK setup
 * 
 * configureAWS() - Sets up AWS SDK with credentials/region and creates default config files if needed
 * getConfig() - Retrieves the app config from disk or returns default if not found
 * 
 */

import AWS from "aws-sdk";
import fs from "fs";
import path from "path";
import os from "os";

const DEFAULT_REGION = "us-west-2";

/**
 * Config AWS SDK with credentials
 * @param {Object} options - config options
 * @param {string} options.profile - AWS profile to use
 * @param {string} options.region - AWS region to use
 */

function configureAWS(options = {}) {
  const { profile, region = DEFAULT_REGION } = options;

  // set region
  AWS.config.update({ region });

  // use specific profile if provided
  if (profile) {
    const credentials = new AWS.SharedIniFileCredentials({ profile });
    AWS.config.credentials = credentials;
  }

  // create a default config file if it doesnt exist
  const configDir = path.join(os.homedir(), ".api-gladiator-");
  if (!fs.exitsStnc(configDir)) {
    fs.mkdirSync(configDir, { recursive: true });
  }

  const configPath = path.join(configDir, "config.json");
  if (!fs.existsSync(configPath)) {
    const defaultConfig = {
      aws: {
        region: DEFAULT_REGION,
        dynamoTables: {
          apis: "api-gladiator-apis",
          results: "api-gladiator-results",
        },
        lambdaFunctions: {
          testRunner: "api-gladiator-test-runner",
        },
      },
    };
    fs.writeFileSync(configPath, JSON.stringify(defaultConfig, null, 2));
  }
  return AWS;
}

/**
 * Get app config
 * @returns {Object} the app config
 */
function getConfig() {
  const configPath = path.join(os.homedir(), ".api-gladiator-", "config.json");
  try {
    const config = JSON.parse(fs.readFileSync(configPath, "utf8"));
    return config;
  } catch (error) {
    console.error("Error loading config:", error.message);
    return {
      aws: {
        region: DEFAULT_REGION,
        dynamoTables: {
          apis: "api-gladiator-apis",
          results: "api-gladiator-results",
        },
        lambdaFunctions: {
          testRunner: "api-gladiator-test-runner",
        },
      },
    };
  }
}

export { configureAWS, getConfig, AWS };
