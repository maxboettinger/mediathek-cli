/**
    {
      channel: 'ARD',
      topic: 'Hannes und der Bürgermeister',
      title: 'Partnerschaftsanzeige und Komede Francaise',
      description: 'Beim Verfassen einer Anzeige auf der Suche nach einer Partnerin ist Hannes seinem Bürgermeister keine große Hilfe. Hannes will Urlaub machen und soll seinen französischen Amtsboten aus der Partnerstadt einlernen.',
      timestamp: 1638306900,
      duration: 1837,
      size: 387973120,
      url_website: 'https://www.ardmediathek.de/video/Y3JpZDovL3N3ci5kZS9hZXgvbzE1NzI1NzQ',
      url_subtitle: 'https://api.ardmediathek.de/subtitle-format-service/ebutt/urn:ard:subtitle:dd02072c859e6c70',
      url_video: 'https://pdodswr-a.akamaihd.net/swrfernsehen/hannes-und-der-buergermeister/1572574.l.mp4',
      url_video_low: 'https://pdodswr-a.akamaihd.net/swrfernsehen/hannes-und-der-buergermeister/1572574.ml.mp4',
      url_video_hd: 'http://pdodswr-a.akamaihd.net/swrfernsehen/hannes-und-der-buergermeister/1572574.xxl.mp4',
      filmlisteTimestamp: '1638310560',
      id: 'VsSqn/LCO/30LPlR3PaPFtPj3F7n5epUK084yxU2QP4='
    },
 */
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
      "s"
  );
  log(""); // yeah this is probably bad, but easier to identify than "\n"

  CliUx.ux.table(
    api_response.results,
    {
      id: {
        header: "Entry",
        get: (row) =>
          api_response.results.findIndex((x: any) => x.id === row.id) +
          pagination * limit,
      },
      title: {
        //minWidth: 7,
      },
      topic: {
        //get: row => row.company && row.company.name
      },
      channel: {
        minWidth: 10,
      },
      duration: {
        get: (row: any) => (row.duration / 60).toFixed(2) + "m",
        //minWidth: 8,
      },
      published: {
        get: (row: any) =>
          moment(row.timestamp, "X").format("DD.MM.YYYY HH:mm"),
      },
    },
    {}
  );

  log(""); // yeah this is probably bad, but easier to identify than "\n"
  log(
    "use " +
      chalk.bold.italic("media detail {entry id}") +
      " to view detailed information for an entry"
  );
  log(
    "use " +
      chalk.bold.italic("media query {...your last query} -p {desired page}") +
      " to use pagination"
  );
  log(""); // yeah this is probably bad, but easier to identify than "\n"
}

export function showDetail(element: any) {
  log("\n" + chalk.bold.underline("" + element.title + "") + "");

  log(
    "Aus " +
      chalk.white.bold(element.topic) +
      " in " +
      chalk.white.bold(element.channel) +
      " vom " +
      chalk.bold.white(
        moment(element.timestamp, "X").format("DD.MM.YYYY HH:mm")
      ) +
      " Laufzeit: " +
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

// depricated as replaced by table
/*
export function show_apiResults(
  api_response: any,
  pagination: any,
  limit: any
) {
  let counter = parseInt(pagination) + 1;
  let last_title = "";

  log(
    "\nShowing " +
      chalk.bold(
        parseInt(pagination) + 1 + "-" + (parseInt(pagination) + limit)
      ) +
      " of " +
      chalk.bold(api_response.queryInfo.totalResults) +
      " results found in " +
      chalk.bold(api_response.queryInfo.searchEngineTime) +
      "s"
  );

  api_response.results.forEach((element: any) => {
    if (counter > limit) {
      return;
    }

    //if (element.title != last_title) {
    if (true) {
      log(
        "\n[" +
          counter +
          "] " +
          chalk.bold.underline("" + element.title + "") +
          ""
      );

      log(
        "Aus " +
          chalk.white.bold(element.topic) +
          " in " +
          chalk.white.bold(element.channel) +
          " vom " +
          chalk.bold.white(
            moment(element.timestamp, "X").format("DD.MM.YYYY HH:mm")
          ) +
          " Laufzeit: " +
          chalk.bold.white((element.duration / 60).toFixed(2) + "m")
      );

      if (limit < 2) {
        log("FHD: " + chalk.gray(element.url_video_hd));
      }

      last_title = element.title;
      counter++;
    }
  });

  console.log("\n");
}
*/
