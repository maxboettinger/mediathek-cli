import axios from "axios";
const https = require("https");
const fs = require("fs");
const signale = require("signale");
const api_url = "https://mediathekviewweb.de/feed?query=";

export function makeRequest(term: any): Promise<any> {
  return new Promise(async (resolve, reject) => {
    //signale.pending("Searching for '%s'", term);

    try {
      const { data } = await axios.get(api_url + term);

      //signale.success("Got results from mediathek api!");

      resolve(data);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        signale.fatal(new Error("Unable to make request"));
        reject(error);
      } else {
        reject(error);
      }
    }
  });
}

export function downloadFile(user_path: any, url: any): Promise<any> {
  return new Promise(async (resolve, reject) => {
    signale.pending("Starting download for '%s'", url);

    https.get(url, (res: any) => {
      const path = user_path + "file.mp4";
      const writeStream = fs.createWriteStream(path);

      res.pipe(writeStream);

      writeStream.on("finish", () => {
        writeStream.close();
        signale.success("Finished download! File can be found @ " + path);
        resolve(true);
      });
    });
  });
}
