import type { Arguments, CommandBuilder } from "yargs";
import { downloadFile, makeRequest } from "../modules/request";
import { showResults } from "../modules/tui";
import { parseXml } from "../modules/xml";

type Options = {
  name: string;
  upper: boolean | undefined;
};

export const command: string = "download <path> <url>";
export const desc: string = "Download file from <url>";

export const builder: CommandBuilder<Options, Options> = (yargs) =>
  yargs
    .positional("path", { type: "string", demandOption: true })
    .positional("url", { type: "string", demandOption: true });

export const handler = async (argv: Arguments<Options>): Promise<void> => {
  // get argument values
  const { path, url } = argv;

  await downloadFile(path, url);

  // done
  console.log("\n\n");
  process.exit(0);
};
