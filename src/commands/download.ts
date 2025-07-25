import {Args, Command} from '@oclif/core';

import {DownloadManager} from '../modules/core-download';
import {waitForKey} from '../modules/core-ui';
import {loadHistory} from '../modules/fs';

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

    const itemDetail = await loadHistory(args.id as number, this.config.cacheDir);
    
    if (!itemDetail) {
      console.error('No entry found for ID ' + args.id);
      return;
    }

    const downloader = new DownloadManager(itemDetail);
    
    const quality = await downloader.selectQuality();
    if (quality) {
      await downloader.download(quality);
    }
    
    await waitForKey();
  }
}
