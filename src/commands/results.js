/**
 * Results Command
 * View and export test results
 */

export default function (program) {
  // define the results command for viewing test results
  program
    .command("results")
    .description("View test results")
    .option("--api-id <id>", "Filter results by API ID")
    .option("--test-id <id>", "Show results for a specific test")
    .option("--format <format>", "Output format (table, json, csv)", "table")
    .option("--limit <number>", "Maximum number of results to show", "10")
    .action(async (options) => {
      console.log(`Displaying test results for ${options.apiId || options.testId || "all APIs"}`);
      console.log("Under development :/ check back later!");
    });

  // define the export command for saving test results to files
  program
    .command("export")
    .description("Export test results to a file")
    .requiredOption("--api-id <id>", "API ID to export results for")
    .option("--format <format>", "Export format (json, csv)", "json")
    .option("--output <filepath>","Output file path","./api-gladiator-results.json")
    .action(async (options) => {
      console.log(
        `This command will export test results for API ${options.apiId}`
      );
      console.log("This feature is under development. Check back soon!");
    });
}
