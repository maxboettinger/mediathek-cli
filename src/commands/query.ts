import { Command, Flags, CliUx } from "@oclif/core";
import { draw_table } from "../modules/cli_output";
import { save_history } from "../modules/fs";
import { queryApi } from "../modules/request";

export default class Query extends Command {
  static description = "query the mediathek";

  static examples = ["<%= config.bin %> <%= command.id %>"];

  static flags = {
    title: Flags.string({ char: "t", description: "title to query" }),
    topic: Flags.string({ char: "s", description: "topic (sendung) to query" }),
    channel: Flags.string({ char: "c", description: "channel to query" }),
    limit: Flags.integer({
      char: "l",
      description: "limit amounts of displayed results",
      default: 15,
    }),
    page: Flags.integer({
      char: "p",
      description: "use pagination for last query",
      default: 0,
    }),
    dmin: Flags.integer({
      description: "minimum duration (in minutes)",
      default: 0,
    }),
    dmax: Flags.integer({
      description: "maximum duration (in minutes)",
      default: 99999,
    }),
    sortBy: Flags.string({
      description:
        "define the parameter for sorting. Supported: timestamp; duration",
      options: ["timestamp", "duration"],
      default: "timestamp",
    }),
    sortOrder: Flags.string({
      description: "define the sorting order",
      options: ["desc", "asc"],
      default: "desc",
    }),
    future: Flags.boolean({
      description: "choose to allow future shows to be included in results",
      default: true,
    }),
  };

  static args = [];

  public async run(): Promise<void> {
    const { args, flags } = await this.parse(Query);

    //CliUx.ux.action.start("");

    // generate query
    const query = await this.build_query(flags);

    // request API with query
    const api_result = await queryApi(query);

    //CliUx.ux.action.stop("");

    // print results to terminal
    draw_table(api_result, flags.page, flags.limit);

    // save results in history
    await save_history(
      api_result,
      flags.page,
      flags.limit,
      this.config.cacheDir
    );
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
        sortBy: flags.sortBy,
        sortOrder: flags.sortOrder,
        future: flags.future,
        offset: flags.page * flags.limit,
        size: flags.limit,
        duration_min: flags.dmin * 60,
        duration_max: flags.dmax * 60,
      });
    });
  }
}
