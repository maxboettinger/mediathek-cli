import axios from "axios";
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
