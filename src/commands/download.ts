import { Command, Flags, Args } from "@oclif/core";
import inquirer from "inquirer";
import { showDetail } from "../modules/cli_output";
import { load_history } from "../modules/fs";
import { downloadFile } from "../modules/request";

export default class Download extends Command {
  static description = "download a specific mediathek entry";

  static examples = ["$ media download 4"];

  static flags = {};

  static args = {
    id: Args.integer({
      required: true,
      description:
        ":number - the respective Entry ID of the last query to download",
    }),
  };

  public async run(): Promise<void> {
    const { args, flags } = await this.parse(Download);

    // read details from history json file
    const item_detail = await load_history(args.id, this.config.cacheDir);

    // check if provided id can be found in history
    if (!item_detail) {
      console.error("No entry found for provided id " + args.id + "!");
      return;
    }

    // initialize path variables
    let downloadPath = "";
    const defaultDownloadPath =
      this.config.home + "/" + item_detail.url_video_hd.split("/").pop();

    // prompt for download location
    let responses: any = await inquirer.prompt([
      {
        name: "downloadChoice",
        message: "Where should the file be saved?",
        type: "list",
        choices: [
          { name: "default (" + defaultDownloadPath + ")" },
          { name: "custom path" },
        ],
      },
    ]);

    // handle customDownloadPath
    if (responses.downloadChoice == "custom path") {
      const customPathResponse = await inquirer.prompt([
        {
          name: "customPath",
          message: "Enter custom path:",
          type: "input",
        },
      ]);
      downloadPath = customPathResponse.customPath;
    }
    // handle defaultDownloadPath
    else {
      downloadPath = defaultDownloadPath;
    }

    console.log("");

    await downloadFile(downloadPath, item_detail);
  }
}
