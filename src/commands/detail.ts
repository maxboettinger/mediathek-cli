import type { Arguments, CommandBuilder } from "yargs";
import { load_history } from "../modules/local_fs";
import { showDetail } from "../modules/tui";
type Options = {
  name: string;
  upper: boolean | undefined;
};

export const command: string = "d <id>";
export const desc: string = "Inspect search result <id>";

export const builder: CommandBuilder<Options, Options> = (yargs) =>
  yargs.positional("id", { type: "string", demandOption: true });

export const handler = async (argv: Arguments<Options>): Promise<void> => {
  // get argument values
  const { id } = argv;
  const item_detail = await load_history(id);

  showDetail(item_detail);

  // done
  //console.log("\n\n");
  process.exit(0);
};
