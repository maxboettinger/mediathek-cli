import {Args, Command, Flags, ux} from '@oclif/core';
import chalk from 'chalk';

import type {ApiQuery, QueryArgs, QueryFlags} from '../types';
import {ResultsTable, handleTableNavigation} from '../modules/core-ui';
import {saveHistory} from '../modules/fs';
import {queryApi} from '../modules/request';

export default class Search extends Command {
  static args = {
    query: Args.string({
      description: 'search term (optional - will prompt if not provided)',
      required: false,
    }),
  };

  static description = 'Search German public broadcasting media';

  static examples = [
    '$ media search tagesschau -c ARD',
    '$ media search "Wetten, dass..?" -c ZDF --dmin 30', 
    '$ media search  # Interactive mode',
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
      default: 20,
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

  private currentFlags!: QueryFlags;
  private currentArgs!: QueryArgs;

  public async run(): Promise<void> {
    const {args, flags} = await this.parse(Search);
    this.currentFlags = flags as QueryFlags;
    this.currentArgs = args as QueryArgs;

    // Interactive mode if no search term provided
    if (!args.query) {
      this.currentArgs.query = await this.promptForSearchTerm();
    }

    await this.executeSearch();
  }

  private async executeSearch(): Promise<void> {
    const query = this.buildQuery(this.currentFlags, this.currentArgs);
    
    ux.action.start('Searching');
    const apiResult = await queryApi(query);
    ux.action.stop();

    if (apiResult.results.length === 0) {
      console.log(chalk.yellow('No results found'));
      return;
    }

    const table = new ResultsTable(apiResult);
    await saveHistory(apiResult, this.currentFlags.page, this.currentFlags.limit, this.config.cacheDir);

    await handleTableNavigation(table, () => this.refineSearch());
  }

  private async refineSearch(): Promise<void> {
    console.clear();
    console.log(chalk.bold.blue('Refine Search'));
    console.log();

    this.displayCurrentFilters();
    console.log();
    console.log(chalk.gray('Enter new parameters (press Enter to keep current values):'));
    console.log();

    // Professional parameter modification following CLI best practices
    const newSearchTerm = await this.promptForParameter(
      'Search term',
      this.currentArgs.query
    );

    const newChannel = await this.promptForParameter(
      'Channel (ARD, ZDF, etc.) [clear with "none"]',
      this.currentFlags.channel || ''
    );

    const newMinDuration = await this.promptForParameter(
      'Min duration (minutes) [clear with "0"]',
      this.currentFlags.dmin?.toString() || '0'
    );

    const newMaxDuration = await this.promptForParameter(
      'Max duration (minutes) [clear with "none"]',
      this.currentFlags.dmax === 99_999 ? '' : this.currentFlags.dmax?.toString() || ''
    );

    // Apply flag override pattern (standard CLI behavior)
    this.currentArgs.query = newSearchTerm || this.currentArgs.query;
    this.currentFlags.channel = newChannel === 'none' ? undefined : (newChannel || this.currentFlags.channel);
    this.currentFlags.dmin = newMinDuration ? parseInt(newMinDuration, 10) : this.currentFlags.dmin;
    this.currentFlags.dmax = newMaxDuration === 'none' ? 99_999 : (newMaxDuration ? parseInt(newMaxDuration, 10) : this.currentFlags.dmax);

    console.log(chalk.green('✓ Parameters updated'));
    console.log();

    await this.executeSearch();
  }

  private displayCurrentFilters(): void {
    console.log(chalk.gray('Current search parameters:'));
    console.log(`  ${chalk.white('Term:')} ${chalk.cyan(this.currentArgs.query)}`);
    
    if (this.currentFlags.channel) {
      console.log(`  ${chalk.white('Channel:')} ${chalk.cyan(this.currentFlags.channel)}`);
    }
    
    if (this.currentFlags.dmin > 0) {
      console.log(`  ${chalk.white('Min duration:')} ${chalk.yellow(`${this.currentFlags.dmin}min`)}`);
    }
    
    if (this.currentFlags.dmax < 99_999) {
      console.log(`  ${chalk.white('Max duration:')} ${chalk.yellow(`${this.currentFlags.dmax}min`)}`);
    }

    if (this.currentFlags.title) {
      console.log(`  ${chalk.white('Title filter:')} ${chalk.white(this.currentFlags.title)}`);
    }

    if (this.currentFlags.topic) {
      console.log(`  ${chalk.white('Topic filter:')} ${chalk.white(this.currentFlags.topic)}`);
    }
  }

  private async promptForParameter(prompt: string, currentValue: string): Promise<string> {
    const stdin = process.stdin;
    const stdout = process.stdout;
    
    const displayValue = currentValue ? chalk.gray(`[${currentValue}]`) : '';
    stdout.write(`${prompt} ${displayValue}: `);
    
    return new Promise((resolve) => {
      stdin.setEncoding('utf8');
      stdin.resume();
      
      const onData = (data: string) => {
        stdin.removeListener('data', onData);
        stdin.pause();
        const input = data.trim();
        resolve(input);
      };
      
      stdin.on('data', onData);
    });
  }

  private async promptForSearchTerm(): Promise<string> {
    console.clear();
    console.log(chalk.bold.blue('Search German Media'));
    console.log();

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

  private buildQuery(flags: QueryFlags, args: QueryArgs): ApiQuery {
    const queries = [];

    if (flags.title === undefined) {
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