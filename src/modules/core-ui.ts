import chalk from 'chalk';
import moment from 'moment';
import {readdir, stat} from 'node:fs/promises';
import {join} from 'node:path';

import type {ApiResponse, MediaEntry} from '../types';

export interface TableRow {
  id: number;
  data: MediaEntry;
}

export interface NavigationResult {
  action: 'select' | 'view' | 'download' | 'quit' | 'search';
  selectedRow?: TableRow;
}

export class ResultsTable {
  private rows: TableRow[] = [];
  private selectedIndex = 0;
  private pageSize = 10;
  private currentPage = 0;
  
  constructor(private apiResponse: ApiResponse) {
    this.rows = apiResponse.results.map((data, index) => ({
      id: index,
      data,
    }));
  }

  getCurrentPage(): TableRow[] {
    const start = this.currentPage * this.pageSize;
    const end = start + this.pageSize;
    return this.rows.slice(start, end);
  }

  getSelected(): TableRow | undefined {
    const currentPageRows = this.getCurrentPage();
    return currentPageRows[this.selectedIndex % this.pageSize];
  }

  moveUp(): void {
    if (this.selectedIndex > 0) {
      this.selectedIndex--;
    } else if (this.currentPage > 0) {
      this.currentPage--;
      this.selectedIndex = Math.min(this.pageSize - 1, this.getCurrentPage().length - 1);
    }
  }

  moveDown(): void {
    const currentPageRows = this.getCurrentPage();
    if (this.selectedIndex < currentPageRows.length - 1) {
      this.selectedIndex++;
    } else if ((this.currentPage + 1) * this.pageSize < this.rows.length) {
      this.currentPage++;
      this.selectedIndex = 0;
    }
  }

  async render(): Promise<void> {
    console.clear();
    
    // Header
    const start = this.currentPage * this.pageSize + 1;
    const end = Math.min((this.currentPage + 1) * this.pageSize, this.rows.length);
    
    console.log(`${chalk.gray('Results')} ${chalk.white(`${start}-${end}`)} ${chalk.gray('of')} ${chalk.white(this.apiResponse.queryInfo.totalResults)} ${chalk.gray(`(${this.apiResponse.queryInfo.searchEngineTime}ms)`)}`);
    console.log();

    // Rows
    const currentPageRows = this.getCurrentPage();
    
    for (let i = 0; i < currentPageRows.length; i++) {
      const row = currentPageRows[i];
      const isSelected = i === this.selectedIndex;
      
      await this.renderRow(row, isSelected);
    }
    
    console.log();
    console.log(chalk.gray('↑↓ Navigate  Enter Select  v View  d Download  s Search  q Quit'));
  }

  private async renderRow(row: TableRow, isSelected: boolean): Promise<void> {
    const {data} = row;
    const prefix = isSelected ? chalk.blue('▶') : ' ';
    
    // Get file sizes for available qualities
    const sizes = await this.getFileSizes(data);
    const sizeInfo = this.formatSizeInfo(sizes);
    
    const id = chalk.gray(`[${row.id}]`);
    const channel = chalk.cyan(data.channel.padEnd(8));
    const time = chalk.gray(moment(data.timestamp, 'X').format('DD.MM HH:mm'));
    const duration = chalk.yellow(`${Math.round(data.duration / 60)}m`);
    
    let title = data.title;
    if (title.length > 50) {
      title = title.substring(0, 47) + '...';
    }
    
    if (isSelected) {
      title = chalk.bold.white(title);
    }
    
    console.log(`${prefix} ${id} ${channel} ${time} ${duration.padEnd(4)} ${sizeInfo} ${title}`);
    
    if (isSelected && data.topic !== data.title) {
      console.log(`   ${chalk.gray('from')} ${chalk.italic(data.topic)}`);
    }
  }

  private async getFileSizes(data: MediaEntry): Promise<{low?: string; standard?: string; hd?: string}> {
    // For now, return estimated sizes based on duration and quality
    // In production, you might want to make HEAD requests to get actual sizes
    const durationMinutes = data.duration / 60;
    const sizes: {low?: string; standard?: string; hd?: string} = {};
    
    if (data.url_video_low) {
      sizes.low = this.estimateFileSize(durationMinutes, 'low');
    }
    if (data.url_video) {
      sizes.standard = this.estimateFileSize(durationMinutes, 'standard');
    }
    if (data.url_video_hd) {
      sizes.hd = this.estimateFileSize(durationMinutes, 'hd');
    }
    
    return sizes;
  }

  private estimateFileSize(durationMinutes: number, quality: 'low' | 'standard' | 'hd'): string {
    // Rough estimates: low ~5MB/min, standard ~15MB/min, hd ~50MB/min
    const rates = {low: 5, standard: 15, hd: 50};
    const sizeInMB = Math.round(durationMinutes * rates[quality]);
    
    if (sizeInMB < 1024) {
      return `${sizeInMB}MB`;
    }
    return `${(sizeInMB / 1024).toFixed(1)}GB`;
  }

  private formatSizeInfo(sizes: {low?: string; standard?: string; hd?: string}): string {
    const parts = [];
    if (sizes.low) parts.push(chalk.gray(`L:${sizes.low}`));
    if (sizes.standard) parts.push(chalk.white(`S:${sizes.standard}`));
    if (sizes.hd) parts.push(chalk.green(`H:${sizes.hd}`));
    
    return parts.join(' ').padEnd(20);
  }
}

export async function handleKeypress(): Promise<string> {
  return new Promise((resolve) => {
    const stdin = process.stdin;
    stdin.setRawMode(true);
    stdin.resume();
    stdin.setEncoding('utf8');
    
    const onData = (key: string) => {
      stdin.removeListener('data', onData);
      stdin.setRawMode(false);
      stdin.pause();
      
      // Handle different key combinations
      if (key === '\u0003') { // Ctrl+C
        process.exit(0);
      }
      
      switch (key) {
        case '\u001b[A': // Up arrow
          resolve('up');
          break;
        case '\u001b[B': // Down arrow
          resolve('down');
          break;
        case '\r': // Enter
        case '\n':
          resolve('select');
          break;
        case 'v':
          resolve('view');
          break;
        case 'd':
          resolve('download');
          break;
        case 's':
          resolve('search');
          break;
        case 'q':
          resolve('quit');
          break;
        default:
          resolve('unknown');
      }
    };
    
    stdin.on('data', onData);
  });
}

export function renderDetail(data: MediaEntry): void {
  console.clear();
  console.log(chalk.bold.white(data.title));
  console.log();
  
  console.log(`${chalk.gray('Show:')} ${data.topic}`);
  console.log(`${chalk.gray('Channel:')} ${chalk.cyan(data.channel)}`);
  console.log(`${chalk.gray('Published:')} ${moment(data.timestamp, 'X').format('YYYY-MM-DD HH:mm')}`);
  console.log(`${chalk.gray('Duration:')} ${Math.round(data.duration / 60)} minutes`);
  console.log();
  
  if (data.description) {
    console.log(chalk.italic(data.description));
    console.log();
  }
  
  console.log(chalk.gray('Available streams:'));
  if (data.url_video_low) console.log(`  ${chalk.gray('Low:')} ${data.url_video_low}`);
  if (data.url_video) console.log(`  ${chalk.gray('Standard:')} ${data.url_video}`);
  if (data.url_video_hd) console.log(`  ${chalk.gray('HD:')} ${data.url_video_hd}`);
  if (data.url_website) console.log(`  ${chalk.gray('Web:')} ${data.url_website}`);
  
  console.log();
  console.log(chalk.gray('Press any key to return...'));
}

export async function waitForKey(): Promise<void> {
  return new Promise((resolve) => {
    const stdin = process.stdin;
    stdin.setRawMode(true);
    stdin.resume();
    stdin.setEncoding('utf8');
    
    const onData = () => {
      stdin.removeListener('data', onData);
      stdin.setRawMode(false);
      stdin.pause();
      resolve();
    };
    
    stdin.once('data', onData);
  });
}