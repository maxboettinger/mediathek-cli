import axios from "axios";
import { ux } from "@oclif/core";
import chalk from "chalk";
const https = require("https");
const fs = require("fs");
const api_url = "https://mediathekviewweb.de/api/query";

export function queryApi(query: any): Promise<any> {
  return new Promise(async (resolve, reject) => {
    try {
      const { data } = await axios({
        method: "post",
        url: api_url,
        data: JSON.stringify(query),
        headers: { "Content-Type": "text/plain" },
      });

      //console.log(data.result);

      resolve(data.result);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error(new Error("Unable to make request"));
        reject(error);
      } else {
        reject(error);
      }
    }
  });
}

export function downloadFile(
  downloadPath: any,
  item_detail: any
): Promise<any> {
  return new Promise(async (resolve, reject) => {
    ux.action.start("downloading");

    https.get(item_detail.url_video_hd, (res: any) => {
      const writeStream = fs.createWriteStream(downloadPath);

      res.pipe(writeStream);

      writeStream.on("finish", () => {
        writeStream.close();
        ux.action.stop("done!");
        console.log("\nsaved as " + chalk.bold(downloadPath) + "\n");
        resolve(true);
      });
    });
  });
}
