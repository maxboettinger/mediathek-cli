import {Command, ux} from '@oclif/core';
import chalk from 'chalk';

import type {ApiQuery, SearchContext, QueryFlags, QueryArgs} from '../types';
import {queryApi} from '../modules/request';
import {saveHistory} from '../modules/fs';
import {ResultsTable, handleKeypress, renderDetail, waitForKey} from '../modules/core-ui';
import {DownloadManager} from '../modules/core-download';

export default class Search extends Command {
  static description = 'Interactive search for media content';
  static examples = ['$ media search'];
  static flags = {};

  private searchContext?: SearchContext;

  public async run(context?: SearchContext): Promise<void> {
    this.searchContext = context;
    
    console.clear();
    console.log(chalk.bold.blue('Search Media'));
    
    if (context) {
      console.log(chalk.gray('Current filters:'));
      this.displayCurrentFilters(context);
    }
    
    console.log();
    
    const searchTerm = await this.getSearchTerm();
    const query = this.buildQuery(searchTerm);
    
    ux.action.start('Searching');
    const apiResult = await queryApi(query);
    ux.action.stop();
    
    if (apiResult.results.length === 0) {
      console.log(chalk.yellow('No results found'));
      return;
    }
    
    const table = new ResultsTable(apiResult);
    await saveHistory(apiResult, 0, 20, this.config.cacheDir);
    
    await this.handleNavigation(table);
  }

  private async getSearchTerm(): Promise<string> {
    const stdin = process.stdin;
    const stdout = process.stdout;
    
    stdout.write('Enter search term: ');
    
    return new Promise((resolve) => {
      stdin.setEncoding('utf8');
      stdin.resume();
      
      const onData = (data: string) => {
        stdin.removeListener('data', onData);
        stdin.pause();
        resolve(data.trim());
      };
      
      stdin.on('data', onData);
    });
  }

  private displayCurrentFilters(context: SearchContext): void {
    const filters = [];
    if (context.flags.channel) filters.push(`Channel: ${chalk.cyan(context.flags.channel)}`);
    if (context.flags.title) filters.push(`Title: ${chalk.white(context.flags.title)}`);
    if (context.flags.topic) filters.push(`Topic: ${chalk.white(context.flags.topic)}`);
    if (context.flags.dmin > 0) filters.push(`Min duration: ${chalk.yellow(`${context.flags.dmin}min`)}`);
    if (context.flags.dmax < 99_999) filters.push(`Max duration: ${chalk.yellow(`${context.flags.dmax}min`)}`);
    
    console.log(`  ${filters.join(' • ')}`);
  }

  private buildQuery(searchTerm: string): ApiQuery {
    const context = this.searchContext;
    
    if (context) {
      // Use preserved context but update search term
      const queries = [];
      
      if (context.flags.title === undefined) {
        queries.push({fields: ['title'], query: searchTerm});
      } else {
        queries.push({fields: ['title'], query: context.flags.title});
      }
      
      if (context.flags.topic === undefined) {
        queries.push({fields: ['topic'], query: searchTerm});
      } else {
        queries.push({fields: ['topic'], query: context.flags.topic});
      }
      
      if (context.flags.channel !== undefined) {
        queries.push({fields: ['channel'], query: context.flags.channel});
      }
      
      return {
        durationMax: context.flags.dmax * 60,
        durationMin: context.flags.dmin * 60,
        future: context.flags.future,
        offset: context.flags.page * context.flags.limit,
        queries,
        size: context.flags.limit,
        sortBy: context.flags.sortBy,
        sortOrder: context.flags.sortOrder,
      };
    }
    
    // Default behavior for new searches
    return {
      durationMax: 99_999 * 60,
      durationMin: 0,
      future: true,
      offset: 0,
      queries: [
        {fields: ['title'], query: searchTerm},
        {fields: ['topic'], query: searchTerm},
      ],
      size: 20,
      sortBy: 'timestamp',
      sortOrder: 'desc',
    };
  }

  private async handleNavigation(table: ResultsTable): Promise<void> {
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
        case 'select':
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
          await this.run();
          return;
        case 'quit':
          return;
      }
    }
  }
}