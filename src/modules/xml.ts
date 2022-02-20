const { XMLParser, XMLBuilder, XMLValidator } = require("fast-xml-parser");

export function parseXml(xmlData: any): Promise<any> {
  return new Promise(async (resolve, reject) => {
    const parser = new XMLParser();
    let jsonObj = parser.parse(xmlData);

    resolve(jsonObj);
  });
}
