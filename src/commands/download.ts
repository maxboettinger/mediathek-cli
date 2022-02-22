import type { Arguments, CommandBuilder } from "yargs";
import { downloadFile } from "../modules/request";
import { load_history } from "../modules/local_fs";

type Options = {
  name: string;
  upper: boolean | undefined;
};

export const command: string = "download <path> <id>";
export const desc: string = "Download file from <id>";

export const builder: CommandBuilder<Options, Options> = (yargs) =>
  yargs
    .positional("id", { type: "string", demandOption: true })
    .positional("path", { type: "string", demandOption: true });

export const handler = async (argv: Arguments<Options>): Promise<void> => {
  // get argument values
  const { id, path } = argv;

  const item_detail = await load_history(id);

  await downloadFile(path, item_detail);

  // done
  console.log("\n\n");
  process.exit(0);
};
