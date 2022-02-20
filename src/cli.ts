#!/usr/bin/env node

import yargs from "yargs";
import { hideBin } from "yargs/helpers";

yargs(hideBin(process.argv))
  // Use the commands directory to scaffold.
  .commandDir("commands")
  // Enable strict mode.
  .strict()
  // Useful aliases.
  .alias({ h: "help", s: "search" }).argv;

// https://medium.com/geekculture/building-a-node-js-cli-with-typescript-packaged-and-distributed-via-homebrew-15ba2fadcb81
