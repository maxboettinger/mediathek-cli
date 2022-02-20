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

export function showResults(results: any) {
  let counter = 1;

  log(
    "\n\n" +
      chalk.bgGreen.white(
        " Showing results for " +
          chalk.bold.blue(results.rss.channel.description) +
          " "
      )
  );

  results.rss.channel.item.forEach((element: any) => {
    if (counter > 5) {
      return;
    }

    log(
      "\n\n[" +
        counter +
        "] " +
        chalk.bgWhite.black.bold(" " + element.title + " ")
    );

    log(
      "Aus " +
        chalk.white.italic(element.category) +
        " in " +
        chalk.white.italic(element["dc:creator"])
    );

    console.log(
      "Vom " +
        chalk.white(moment(element.pubDate).format("DD.MM.YYYY HH:mm")) +
        " Laufzeit: " +
        chalk.white((element.duration / 60).toFixed(2) + "m")
    );

    log("Link: " + chalk.gray(element.link));
    log(chalk.gray.italic(element.description));

    counter++;
  });
}
