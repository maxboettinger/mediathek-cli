import {Args, Command} from '@oclif/core';
import inquirer from 'inquirer';

import {loadHistory} from '../modules/fs';
import {downloadFile} from '../modules/request';

export default class Download extends Command {
  static args = {
    id: Args.integer({
      description:
        ':number - the respective Entry ID of the last query to download',
      required: true,
    }),
  };
  static description = 'download a specific mediathek entry';
  static examples = ['$ media download 4'];
  static flags = {};

  public async run(): Promise<void> {
    const {args} = await this.parse(Download);

    // read details from history json file
    const itemDetail = await loadHistory(args.id as number, this.config.cacheDir);

    // check if provided id can be found in history
    if (!itemDetail) {
      console.error('No entry found for provided id ' + args.id + '!');
      return;
    }

    // initialize path variables
    let downloadPath = '';
    const defaultDownloadPath
      = this.config.home + '/' + itemDetail.url_video_hd.split('/').pop();

    // prompt for download location
    const responses = await inquirer.prompt([
      {
        choices: [
          {name: 'default (' + defaultDownloadPath + ')'},
          {name: 'custom path'},
        ],
        message: 'Where should the file be saved?',
        name: 'downloadChoice',
        type: 'list',
      },
    ]);

    // handle customDownloadPath
    if (responses.downloadChoice === 'custom path') {
      const customPathResponse = await inquirer.prompt([
        {
          message: 'Enter custom path:',
          name: 'customPath',
          type: 'input',
        },
      ]);
      downloadPath = customPathResponse.customPath;
    } else {
      // handle defaultDownloadPath
      downloadPath = defaultDownloadPath;
    }

    console.log('');

    await downloadFile(downloadPath, itemDetail);
  }
}
