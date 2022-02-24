const fs = require("fs");
const homedir = require("os").homedir();
const path = homedir + "/.mediathek_cli.json";

let local_obj = {
  config: {
    path_download: "",
  },
  history: undefined,
};

export function save_history(data: any): Promise<any> {
  return new Promise(async (resolve, reject) => {
    try {
      local_obj.history = data;
      fs.writeFileSync(path, JSON.stringify(local_obj));
      resolve(true);
    } catch (err) {
      console.error(err);
      reject(false);
    }
  });
}

export function load_history(id: any): Promise<any> {
  return new Promise(async (resolve, reject) => {
    try {
      let json_data = fs.readFileSync(path, "utf8");
      json_data = JSON.parse(json_data);

      resolve(json_data.history.results[parseInt(id) + -1]);
    } catch (err) {
      console.error(err);
      reject(err);
    }
  });
}
