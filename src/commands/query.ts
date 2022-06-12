import { Command, Flags, CliUx } from "@oclif/core";
import { draw_table } from "../modules/cli_output";
import { save_history } from "../modules/fs";
import { queryApi } from "../modules/request";

export default class Query extends Command {
  static description = "query the mediathek";

  static examples = ["<%= config.bin %> <%= command.id %>"];

  static args = [
    {
      name: "query",
      required: true,
      description: ":string - describe what you are searching for",
    },
  ];

  static flags = {
    title: Flags.string({
      char: "t",
      description:
        ":string - search for a specific title [e.g. 'Wetten dass...']",
    }),
    topic: Flags.string({
      char: "s",
      description:
        ":string - search for a specific topic (Sendung) [e.g. 'tagesschau']",
    }),
    channel: Flags.string({
      char: "c",
      description: ":string - limit search to a specific channel [e.g. 'ARD']",
    }),
    limit: Flags.integer({
      char: "l",
      description: ":number - limit search results",
      default: 15,
    }),
    page: Flags.integer({
      char: "p",
      description: ":number - use pagination to view specific result page",
      default: 0,
    }),
    dmin: Flags.integer({
      description: ":number - minimum duration (in minutes)",
      default: 0,
    }),
    dmax: Flags.integer({
      description: ":number - maximum duration (in minutes)",
      default: 99999,
    }),
    sortBy: Flags.string({
      description: ":string - define what to sort by",
      options: ["timestamp", "duration"],
      default: "timestamp",
    }),
    sortOrder: Flags.string({
      description: ":string - define sorting order",
      options: ["desc", "asc"],
      default: "desc",
    }),
    future: Flags.boolean({
      description: ":bool - choose to allow results of future entries",
      default: true,
    }),
  };

  public async run(): Promise<void> {
    const { args, flags } = await this.parse(Query);

    //CliUx.ux.action.start("");

    // generate query
    const query = await this.build_query(flags, args);

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
  public build_query(flags: any, args: any) {
    return new Promise((resolve, reject) => {
      const queries = [];

      if (flags.title != undefined) {
        queries.push({
          fields: ["title"],
          query: flags.title,
        });
      } else {
        // if no explicit title flag is set, use the provided query argument
        queries.push({
          fields: ["title"],
          query: args.query,
        });
      }
      if (flags.topic != undefined) {
        queries.push({
          fields: ["topic"],
          query: flags.topic,
        });
      } else {
        // if no explicit topic flag is set, use the provided query argument
        queries.push({
          fields: ["topic"],
          query: args.query,
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
