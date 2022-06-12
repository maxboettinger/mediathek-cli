import { CliUx } from "@oclif/core";
import * as moment from "moment";
import * as chalk from "chalk";
const log = console.log;

export function draw_table(
  api_response: any,
  pagination: number,
  limit: number
) {
  // check if pagination exceeds result count
  if (pagination * limit >= api_response.queryInfo.totalResults) {
    log(
      "Requested page #" +
        chalk.bold(pagination) +
        " with " +
        chalk.bold(
          pagination * limit + "-" + (pagination * limit + (limit - 1))
        ) +
        " of " +
        chalk.bold(api_response.queryInfo.totalResults) +
        " results found in " +
        chalk.bold(api_response.queryInfo.searchEngineTime) +
        "s"
    );

    log(""); // yeah this is probably bad, but easier to identify than "\n"
    log(chalk.bold.red("pagination exceeds result count!"));
    log(""); // yeah this is probably bad, but easier to identify than "\n"

    return;
  }

  log(
    "Showing page #" +
      chalk.bold(pagination) +
      " with " +
      chalk.bold(
        pagination * limit + "-" + (pagination * limit + (limit - 1))
      ) +
      " of " +
      chalk.bold(api_response.queryInfo.totalResults) +
      " results found in " +
      chalk.bold(api_response.queryInfo.searchEngineTime) +
      "ms"
  );
  log(""); // yeah this is probably bad, but easier to identify than "\n"

  CliUx.ux.table(
    api_response.results,
    {
      id: {
        header: "ID",
        get: (row) =>
          api_response.results.findIndex((x: any) => x.id === row.id) +
          pagination * limit,
      },
      channel: {
        minWidth: 8,
      },
      topic: {
        //get: row => row.company && row.company.name
      },
      title: {
        //minWidth: 50,
      },
      published: {
        get: (row: any) =>
          moment(row.timestamp, "X").format("DD.MM.YYYY HH:mm"),
        minWidth: 19,
      },
      duration: {
        get: (row: any) => (row.duration / 60).toFixed(2) + "m",
        //minWidth: 8,
      },
    },
    {}
  );

  log(""); // yeah this is probably bad, but easier to identify than "\n"
  log(
    "use " +
      chalk.bold.italic("media detail {ID}") +
      " to view detailed information for an entry"
  );
  log(
    "add " +
      chalk.bold.italic("-p {desired page}") +
      " to your last query in order to use pagination"
  );
  log(""); // yeah this is probably bad, but easier to identify than "\n"
}

export function showDetail(element: any) {
  log("\n" + chalk.bold.underline("" + element.title + "") + "");

  log(
    "From " +
      chalk.white.bold(element.topic) +
      " in " +
      chalk.white.bold(element.channel) +
      " published " +
      chalk.bold.white(
        moment(element.timestamp, "X").format("DD.MM.YYYY HH:mm")
      ) +
      " duration: " +
      chalk.bold.white((element.duration / 60).toFixed(2) + "m")
  );

  log("\n" + chalk.gray.italic(element.description));
  console.log();

  log("Web: " + chalk.gray(element.url_website));
  log("SD: " + chalk.gray(element.url_video_low));
  log("HD: " + chalk.gray(element.url_video));
  log("FHD: " + chalk.gray(element.url_video_hd));

  console.log("\n");
}
