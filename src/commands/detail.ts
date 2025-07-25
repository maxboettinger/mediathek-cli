import {Args, Command} from '@oclif/core';

import {renderDetail, waitForKey} from '../modules/core-ui';
import {loadHistory} from '../modules/fs';

export default class Detail extends Command {
  static args = {
    id: Args.integer({
      description:
        ':number - the respective Entry ID of the last query to show details for',
      required: true,
    }),
  };
  static description
    = 'show detailed information for a specific mediathek entry';
  static examples = ['$ media detail 4'];
  static flags = {};

  public async run(): Promise<void> {
    const {args} = await this.parse(Detail);

    const itemDetail = await loadHistory(args.id as number, this.config.cacheDir);
    renderDetail(itemDetail);
    await waitForKey();
  }
}
