import {Command, ux} from '@oclif/core';
import chalk from 'chalk';

import type {ApiQuery} from '../types';
import {queryApi} from '../modules/request';
import {saveHistory} from '../modules/fs';
import {ResultsTable, handleKeypress, renderDetail, waitForKey} from '../modules/core-ui';
import {DownloadManager} from '../modules/core-download';

export default class Search extends Command {
  static description = 'Interactive search for media content';
  static examples = ['$ media search'];
  static flags = {};

  public async run(): Promise<void> {
    console.clear();
    console.log(chalk.bold.blue('Search Media'));
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

  private buildQuery(searchTerm: string): ApiQuery {
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