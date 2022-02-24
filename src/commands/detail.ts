import { Command, Flags } from "@oclif/core";
import { showDetail } from "../modules/cli_output";
import { load_history } from "../modules/fs";

export default class Detail extends Command {
  static description = "describe the command here";

  static examples = ["<%= config.bin %> <%= command.id %>"];

  static flags = {
    /*id: Flags.string({
      char: "i",
      description: "id of result to display details for",
    }),*/
  };

  static args = [{ name: "id" }];

  public async run(): Promise<void> {
    const { args, flags } = await this.parse(Detail);

    // read details from history json file
    const item_detail = await load_history(args.id);

    // print details to terminal
    showDetail(item_detail);
  }
}
