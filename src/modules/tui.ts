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
 */

import { default as moment, Moment } from "moment";
import chalk from "chalk";
const log = console.log;

export function showResults(results: any, pagination_limit: number) {
  let counter = 1;
  let last_title = "";

  log(
    "\nShowing " +
      chalk.bold(pagination_limit) +
      " of " +
      chalk.bold(results.rss.channel.item.length) +
      " results for '" +
      chalk.italic(results.rss.channel.description) +
      "'"
  );

  results.rss.channel.item.forEach((element: any) => {
    if (counter > pagination_limit) {
      return;
    }

    if (element.title != last_title) {
      log(
        "\n[" + counter + "] " + chalk.bold.underline("" + element.title + "")
      );

      log(
        "Aus " +
          chalk.white.bold(element.category) +
          " in " +
          chalk.white.bold(element["dc:creator"]) +
          " vom " +
          chalk.bold.white(moment(element.pubDate).format("DD.MM.YYYY HH:mm")) +
          " Laufzeit: " +
          chalk.bold.white((element.duration / 60).toFixed(2) + "m")
      );

      last_title = element.title;
      counter++;
    }
  });

  console.log("\n");
}

export function showDetail(element: any) {
  log("\n" + chalk.bold.underline("" + element.title + ""));

  log(
    "Aus " +
      chalk.white.bold(element.category) +
      " in " +
      chalk.white.bold(element["dc:creator"]) +
      " vom " +
      chalk.bold.white(moment(element.pubDate).format("DD.MM.YYYY HH:mm")) +
      " Laufzeit: " +
      chalk.bold.white((element.duration / 60).toFixed(2) + "m")
  );

  log("Link: " + chalk.gray(element.link));
  log("Web: " + chalk.gray(element.websiteUrl));
  log("\n" + chalk.gray.italic(element.description));

  console.log("\n");
}
