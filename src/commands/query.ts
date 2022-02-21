import type { Arguments, CommandBuilder } from "yargs";
import { saveAsJson } from "../modules/local_fs";
import { queryApi } from "../modules/request";
import { show_apiResults } from "../modules/tui";

type Options = {
  name: string;
  upper: boolean | undefined;
};

export const command: string = "q";
export const desc: string = "Query mediathek API for <term>";

export const builder: CommandBuilder<Options, Options> = (yargs) =>
  yargs
    //.positional("term", { type: "string", demandOption: true })
    .option("title", { type: "string", demandOption: false })
    .option("topic", { type: "string", demandOption: false })
    .option("page", { type: "string", demandOption: false })
    .option("channel", { type: "string", demandOption: false })
    .option("duration", { type: "number", demandOption: false });

export const handler = async (argv: Arguments<Options>): Promise<void> => {
  // get argument values
  const { title, topic, page, channel, duration } = argv;
  const page_option = page || 0;
  const dur_option = duration || 0;

  const queries = [];

  if (title != undefined) {
    queries.push({
      fields: ["title"],
      query: title,
    });
  }
  if (topic != undefined) {
    queries.push({
      fields: ["topic"],
      query: topic,
    });
  }
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
    duration_min: dur_option,
    duration_max: 99999,
  };

  const api_result = await queryApi(query);

  show_apiResults(api_result, page_option);

  await saveAsJson(api_result);

  // done
  //console.log("\n\n");
  process.exit(0);
};
