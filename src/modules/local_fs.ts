const fs = require("fs");
const path = "./search.json";

export function saveAsJson(data: any): Promise<any> {
  return new Promise(async (resolve, reject) => {
    try {
      fs.writeFileSync(path, JSON.stringify(data));
      resolve(true);
    } catch (err) {
      console.error(err);
      reject(false);
    }
  });
}

export function loadFromJson(id: any): Promise<any> {
  return new Promise(async (resolve, reject) => {
    try {
      let json_data = fs.readFileSync(path, "utf8");
      json_data = JSON.parse(json_data);

      resolve(json_data.results[parseInt(id) + -1]);
    } catch (err) {
      console.error(err);
      reject(err);
    }
  });
}
