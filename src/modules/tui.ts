/**
 * 
 {
  title: 'Märchen',
  description: 'Hannes übernimmt eine Videothek in seinem Bestreben nach Nebentätigkeit. Was er allerdings für Filme verleiht, das weiß weder er, noch der Bürgermeister.',
  link: 'https://pdodswr-a.akamaihd.net/swrfernsehen/hannes-und-der-buergermeister/1548125.xxl.mp4',
  guid: 'DuNE57grLJbic8iJM7xztqJnN5v3LBvlbV9GaQiECds=',
  category: 'Hannes und der Bürgermeister',
  'dc:creator': 'SWR',
  pubDate: 'Fri, 15 Oct 2021 06:20:00 GMT',
  enclosure: '',
  duration: 896,
  websiteUrl: 'https://www.ardmediathek.de/video/Y3JpZDovL3N3ci5kZS9hZXgvbzE1NDgxMjU'
}
 * 

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

import { default as moment, Moment } from "moment";
import chalk from "chalk";
const log = console.log;

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
