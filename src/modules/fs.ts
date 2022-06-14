const fs = require("fs");
const cacheFile = "/.mediathek_cli.json";

let local_obj = {
  config: {
    path_download: "",
  },
  history: [],
};

export function save_history(
  data: any,
  page: number,
  limit: number,
  cacheDir: string
): Promise<any> {
  return new Promise(async (resolve, reject) => {
    try {
      let temp_list = data.results;

      // append entry id's to results
      for (let i = 0; i < temp_list.length; i++) {
        temp_list[i]["local_id"] = i + page * limit;
      }

      local_obj.history = temp_list;

      fs.writeFileSync(cacheDir + cacheFile, JSON.stringify(local_obj));
      resolve(true);
    } catch (err) {
      console.error(err);
      reject(false);
    }
  });
}

export function load_history(id: number, cacheDir: string): Promise<any> {
  return new Promise(async (resolve, reject) => {
    try {
      let json_data = fs.readFileSync(cacheDir + cacheFile, "utf8");
      json_data = JSON.parse(json_data);

      let entry = json_data.history.find((item: any) => {
        return item.local_id == id;
      });

      resolve(entry);
    } catch (err) {
      //console.error(err);
      console.error("No entry found for provided {entry id} (" + id + ")");
      reject(err);
    }
  });
}
