import { Command, Flags } from "@oclif/core";
import { show_apiResults } from "../modules/cli_output";
import { save_history } from "../modules/fs";
import { queryApi } from "../modules/request";

export default class Query extends Command {
  static description = "describe the command here";

  static examples = ["<%= config.bin %> <%= command.id %>"];

  static flags = {
    title: Flags.string({ char: "t", description: "title to query" }),
    topic: Flags.string({ char: "s", description: "topic (sendung) to query" }),
    channel: Flags.string({ char: "c", description: "channel to query" }),
    limit: Flags.string({
      char: "l",
      description: "limit amounts of displayed results",
    }),
  };

  static args = [];

  public async run(): Promise<void> {
    const { args, flags } = await this.parse(Query);

    // generate query
    const query = await this.build_query(flags);

    // request API with query
    const api_result = await queryApi(query);

    // print results to terminal
    show_apiResults(api_result, 0, flags.limit);

    // save results in history
    await save_history(api_result);
  }

  /**
   * build_query
   */
  public build_query(flags: any) {
    return new Promise((resolve, reject) => {
      const queries = [];

      if (flags.title != undefined) {
        queries.push({
          fields: ["title"],
          query: flags.title,
        });
      }
      if (flags.topic != undefined) {
        queries.push({
          fields: ["topic"],
          query: flags.topic,
        });
      }
      if (flags.channel != undefined) {
        queries.push({
          fields: ["channel"],
          query: flags.channel,
        });
      }

      resolve({
        queries: queries,
        sortBy: "timestamp",
        sortOrder: "desc",
        future: true,
        offset: 0,
        //size: 10,
        duration_min: 0,
        duration_max: 99999,
      });
    });
  }
}
