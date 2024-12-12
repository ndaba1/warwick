#! /usr/bin/env node

import { program } from "commander";
import { startServer } from "./handler.js"

const DEFAULT_PORT = 3000;

program
  .command("dev")
  .description("Start your warwick app")
  .option("-p, --port <port>", "Port to run the server on")
  .action(async (options) => {
    const port = options.port || DEFAULT_PORT;
    await startServer(port);
  });

program.parse(process.argv);