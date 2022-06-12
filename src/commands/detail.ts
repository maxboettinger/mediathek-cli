import { Command, Flags } from "@oclif/core";
import { showDetail } from "../modules/cli_output";
import { load_history } from "../modules/fs";

export default class Detail extends Command {
  static description =
    "show detailed information for a specific mediathek entry";

  static examples = ["$ media detail 4"];

  static flags = {};

  static args = [
    {
      name: "id",
      required: true,
      description:
        ":number - the respective Entry ID of the last query to show details for",
    },
  ];

  public async run(): Promise<void> {
    const { args, flags } = await this.parse(Detail);

    // read details from history json file
    const item_detail = await load_history(args.id, this.config.cacheDir);

    // print details to terminal
    showDetail(item_detail);
  }
}
