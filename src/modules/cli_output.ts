import moment from "moment";
import chalk from "chalk";
import Table from "cli-table3";
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

  const table = new Table({
    head: ['ID', 'Channel', 'Topic', 'Title', 'Published', 'Duration'],
    colWidths: [5, 10, 20, 50, 17, 8]
  });

  api_response.results.forEach((row: any, index: number) => {
    table.push([
      (index + pagination * limit).toString(),
      row.channel,
      row.topic,
      row.title,
      moment(row.timestamp, "X").format("DD.MM.YYYY HH:mm"),
      (row.duration / 60).toFixed(2) + "m"
    ]);
  });

  log(table.toString());

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
