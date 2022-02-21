import type { Arguments, CommandBuilder } from "yargs";
import { saveAsJson } from "../modules/local_fs";
import { queryApi } from "../modules/request";
import { show_apiResults } from "../modules/tui";

type Options = {
  name: string;
  upper: boolean | undefined;
};

export const command: string = "q <term>";
export const desc: string = "Query mediathek API for <term>";

export const builder: CommandBuilder<Options, Options> = (yargs) =>
  yargs
    .positional("term", { type: "string", demandOption: true })
    .option("page", { type: "string", demandOption: false })
    .option("channel", { type: "string", demandOption: false });

export const handler = async (argv: Arguments<Options>): Promise<void> => {
  // get argument values
  const { term, page, channel } = argv;
  const page_option = page || 0;

  const queries = [
    {
      fields: ["topic", "title"],
      query: term,
    },
  ];

  if (channel != undefined) {
    queries.push({
      fields: ["channel"],
      query: channel,
    });
  }

  const query = {
    queries: queries,
    sortBy: "timestamp",
    sortOrder: "desc",
    future: true,
    offset: page_option,
    //size: 10,
    duration_min: 0,
    duration_max: 99999,
  };

  const api_result = await queryApi(query);

  show_apiResults(api_result, page_option);

  await saveAsJson(api_result);

  // done
  //console.log("\n\n");
  process.exit(0);
};
