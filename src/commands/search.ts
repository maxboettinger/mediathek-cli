import type { Arguments, CommandBuilder } from "yargs";
import { saveAsJson } from "../modules/local_fs";
import { makeRequest } from "../modules/request";
import { showResults } from "../modules/tui";
import { parseXml } from "../modules/xml";

type Options = {
  name: string;
  upper: boolean | undefined;
};

export const command: string = "s <term>";
export const desc: string = "Search mediathek for <term>";

export const builder: CommandBuilder<Options, Options> = (yargs) =>
  yargs.positional("term", { type: "string", demandOption: true });

export const handler = async (argv: Arguments<Options>): Promise<void> => {
  // get argument values
  const { term } = argv;
  const pagination_limit = 5;

  const xml_result = await makeRequest(term);
  const json_result = await parseXml(xml_result);

  showResults(json_result, pagination_limit);

  await saveAsJson(json_result.rss.channel);

  // done
  //console.log("\n\n");
  process.exit(0);
};
