// Database operations cli

const resetMongo = require("./mongo/reset");
const exportSelections = require("./mongo/export");

// ========================================

require("yargs") // eslint-disable-line
  .usage("Usage: node $0 <command>")
  .command(
    "reset",
    "Reset all data in database.",
    () => {},
    (argv) => {
      resetMongo();
    }
  )
  .command(
    "export",
    "Export student selections to server/database/private-data/ folder.",
    (yargs) => {
      yargs.option("f", {
        alias: "file",
        demandOption: true,
        default: "selections.json",
        describe: "The output filename.",
        type: "string",
      });
    },
    (argv) => {
      exportSelections(argv.f);
    }
  )
  .command(
    "update-opentime",
    "Update openTime.",
    (yargs) => {
      yargs.positional("resource", {
        describe: "Resource to be update",
        choices: ["opentime"],
      });
    },
    (argv) => {
      updateOpentime();
    }
  )
  .epilog("Type 'node database.js <command> --help' for help of each command.")
  .alias("h", "help")
  .version(false)
  .strictCommands(true)
  .demandCommand(1, "No command specified.").argv;
