import type { Arguments, CommandBuilder } from "yargs";
import { saveAsJson } from "../modules/local_fs";
import { queryApi } from "../modules/request";
import { showResults, show_apiResults } from "../modules/tui";

type Options = {
  name: string;
  upper: boolean | undefined;
};

export const command: string = "q <term>";
export const desc: string = "Query mediathek API for <term>";

export const builder: CommandBuilder<Options, Options> = (yargs) =>
  yargs.positional("term", { type: "string", demandOption: true });

export const handler = async (argv: Arguments<Options>): Promise<void> => {
  // get argument values
  const { term } = argv;
  const pagination_limit = 15;
  const query = {
    queries: [
      {
        fields: ["topic", "title"],
        query: term,
      },
    ],
    sortBy: "timestamp",
    sortOrder: "desc",
    future: true,
    offset: 0,
    //size: 10,
    duration_min: 0,
    duration_max: 99999,
  };

  const api_result = await queryApi(query);

  show_apiResults(api_result, pagination_limit);

  await saveAsJson(api_result);

  // done
  //console.log("\n\n");
  process.exit(0);
};
