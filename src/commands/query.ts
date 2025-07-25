import {
  Args, Command, Flags,
} from '@oclif/core';
import chalk from 'chalk';

import type {ApiQuery, QueryArgs, QueryFlags, SearchContext} from '../types';

import {ResultsTable, handleKeypress, renderDetail, waitForKey} from '../modules/core-ui';
import {DownloadManager} from '../modules/core-download';
import {saveHistory} from '../modules/fs';
import {queryApi} from '../modules/request';

export default class Query extends Command {
  static args = {
    query: Args.string({
      description: ':string - describe what you are searching for',
      required: true,
    }),
  };
  static description = 'query the mediathek';
  static examples = [
    '$ media query tagesschau -c ARD -t "20:00 Uhr"',
    '$ media query "Wetten, dass..?" -c ZDF --dmin 30',
  ];
  static flags = {
    channel: Flags.string({
      char: 'c',
      description: ':string - limit search to a specific channel [e.g. \'ARD\']',
    }),
    dmax: Flags.integer({
      default: 99_999,
      description: ':number - maximum duration (in minutes)',
    }),
    dmin: Flags.integer({
      default: 0,
      description: ':number - minimum duration (in minutes)',
    }),
    future: Flags.boolean({
      default: true,
      description: ':bool - choose to allow results of future entries',
    }),
    limit: Flags.integer({
      char: 'l',
      default: 15,
      description: ':number - limit search results',
    }),
    page: Flags.integer({
      char: 'p',
      default: 0,
      description: ':number - use pagination to view specific result page',
    }),
    sortBy: Flags.string({
      default: 'timestamp',
      description: ':string - define what to sort by',
      options: ['timestamp', 'duration'],
    }),
    sortOrder: Flags.string({
      default: 'desc',
      description: ':string - define sorting order',
      options: ['desc', 'asc'],
    }),
    title: Flags.string({
      char: 't',
      description:
        ':string - search for a specific title [e.g. \'Wetten dass...\']',
    }),
    topic: Flags.string({
      char: 's',
      description:
        ':string - search for a specific topic (Sendung) [e.g. \'tagesschau\']',
    }),
  };

  public async run(): Promise<void> {
    const {args, flags} = await this.parse(Query);

    const query = this.buildQuery(flags as QueryFlags, args as QueryArgs);
    const apiResult = await queryApi(query);

    if (apiResult.results.length === 0) {
      this.log(chalk.yellow('No results found'));
      return;
    }

    const table = new ResultsTable(apiResult);
    await saveHistory(apiResult, flags.page, flags.limit, this.config.cacheDir);

    while (true) {
      await table.render();
      const key = await handleKeypress();
      const selected = table.getSelected();

      switch (key) {
        case 'up':
          table.moveUp();
          break;
        case 'down':
          table.moveDown();
          break;
        case 'view':
          if (selected) {
            renderDetail(selected.data);
            await waitForKey();
          }
          break;
        case 'download':
          if (selected) {
            const downloader = new DownloadManager(selected.data);
            const quality = await downloader.selectQuality();
            if (quality) {
              await downloader.download(quality);
              await waitForKey();
            }
          }
          break;
        case 'search':
          const Search = await import('./search');
          const searchCmd = new Search.default([], this.config);
          const searchContext: SearchContext = {
            flags: flags as QueryFlags,
            args: args as QueryArgs
          };
          await searchCmd.run(searchContext);
          return;
        case 'quit':
          return;
        case 'select':
          if (selected) {
            renderDetail(selected.data);
            await waitForKey();
          }
          break;
      }
    }
  }

  /**
   * Build query object for the API request
   */
  private buildQuery(flags: QueryFlags, args: QueryArgs): ApiQuery {
    const queries = [];

    if (flags.title === undefined) {
      // if no explicit title flag is set, use the provided query argument
      queries.push({
        fields: ['title'],
        query: args.query,
      });
    } else {
      queries.push({
        fields: ['title'],
        query: flags.title,
      });
    }

    if (flags.topic === undefined) {
      // if no explicit topic flag is set, use the provided query argument
      queries.push({
        fields: ['topic'],
        query: args.query,
      });
    } else {
      queries.push({
        fields: ['topic'],
        query: flags.topic,
      });
    }

    if (flags.channel !== undefined) {
      queries.push({
        fields: ['channel'],
        query: flags.channel,
      });
    }

    return {
      durationMax: flags.dmax * 60,
      durationMin: flags.dmin * 60,
      future: flags.future,
      offset: flags.page * flags.limit,
      queries,
      size: flags.limit,
      sortBy: flags.sortBy,
      sortOrder: flags.sortOrder,
    };
  }
}
