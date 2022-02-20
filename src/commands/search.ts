import type { Arguments, CommandBuilder } from "yargs";
import { makeRequest } from "../modules/request";
import { showResults } from "../modules/tui";
import { parseXml } from "../modules/xml";
const signale = require("signale");

type Options = {
  name: string;
  upper: boolean | undefined;
};

export const command: string = "search <term>";
export const desc: string = "Search mediathek for <term>";

export const builder: CommandBuilder<Options, Options> = (yargs) =>
  yargs.positional("term", { type: "string", demandOption: true });

export const handler = async (argv: Arguments<Options>): Promise<void> => {
  // get argument values
  const { term } = argv;

  const xml_result = await makeRequest(term);
  const json_result = await parseXml(xml_result);

  showResults(json_result);

  // done
  console.log("\n\n");
  process.exit(0);
};
