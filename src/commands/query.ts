import {Args, Command, Flags} from '@oclif/core';
import SearchCommand from './search';

export default class Query extends Command {
  static args = {
    query: Args.string({
      description: 'search term',
      required: true,
    }),
  };

  static description = 'Search German public broadcasting media (alias for search command)';

  static examples = [
    '$ media query tagesschau -c ARD -t "20:00 Uhr"',
    '$ media query "Wetten, dass..?" -c ZDF --dmin 30',
  ];

  static flags = {
    channel: Flags.string({
      char: 'c',
      description: 'limit search to specific channel (ARD, ZDF, etc.)',
    }),
    dmax: Flags.integer({
      default: 99_999,
      description: 'maximum duration in minutes',
    }),
    dmin: Flags.integer({
      default: 0,
      description: 'minimum duration in minutes',
    }),
    future: Flags.boolean({
      default: true,
      description: 'include future broadcasts',
    }),
    limit: Flags.integer({
      char: 'l',
      default: 15,
      description: 'number of results to show',
    }),
    page: Flags.integer({
      char: 'p',
      default: 0,
      description: 'page number for pagination',
    }),
    sortBy: Flags.string({
      default: 'timestamp',
      description: 'sort results by timestamp or duration',
      options: ['timestamp', 'duration'],
    }),
    sortOrder: Flags.string({
      default: 'desc',
      description: 'sort order ascending or descending',
      options: ['desc', 'asc'],
    }),
    title: Flags.string({
      char: 't',
      description: 'search specifically in titles',
    }),
    topic: Flags.string({
      char: 's',
      description: 'search specifically in topics/shows',
    }),
  };

  public async run(): Promise<void> {
    const {args, flags} = await this.parse(Query);
    
    // Delegate to unified search command
    const searchCommand = new SearchCommand([args.query, ...this.argv.slice(1)], this.config);
    await searchCommand.run();
  }
}