import {ux} from '@oclif/core';
import chalk from 'chalk';
import https from 'node:https';
import {createWriteStream} from 'node:fs';
import {access} from 'node:fs/promises';

import type {MediaEntry} from '../types';
import {handleKeypress} from './core-ui';

export interface QualityOption {
  label: string;
  url: string;
  estimatedSize: string;
}

export class DownloadManager {
  constructor(private data: MediaEntry) {}

  getAvailableQualities(): QualityOption[] {
    const options: QualityOption[] = [];
    const duration = Math.round(this.data.duration / 60);
    
    if (this.data.url_video_low) {
      options.push({
        label: 'Low',
        url: this.data.url_video_low,
        estimatedSize: `${Math.round(duration * 5)}MB`,
      });
    }
    
    if (this.data.url_video) {
      options.push({
        label: 'Standard',
        url: this.data.url_video,
        estimatedSize: `${Math.round(duration * 15)}MB`,
      });
    }
    
    if (this.data.url_video_hd) {
      options.push({
        label: 'HD',
        url: this.data.url_video_hd,
        estimatedSize: `${Math.round(duration * 50)}MB`,
      });
    }
    
    return options;
  }

  async selectQuality(): Promise<QualityOption | null> {
    const options = this.getAvailableQualities();
    
    if (options.length === 0) {
      console.log(chalk.red('No download options available'));
      return null;
    }
    
    console.clear();
    console.log(chalk.bold.white('Select Quality'));
    console.log();
    
    let selectedIndex = 0;
    
    while (true) {
      // Render options
      for (let i = 0; i < options.length; i++) {
        const option = options[i];
        const prefix = i === selectedIndex ? chalk.blue('▶') : ' ';
        const label = i === selectedIndex ? chalk.bold.white(option.label) : option.label;
        
        console.log(`${prefix} ${label.padEnd(10)} ${chalk.gray(option.estimatedSize)}`);
      }
      
      console.log();
      console.log(chalk.gray('↑↓ Navigate  Enter Select  q Cancel'));
      
      const key = await handleKeypress();
      
      switch (key) {
        case 'up':
          selectedIndex = Math.max(0, selectedIndex - 1);
          break;
        case 'down':
          selectedIndex = Math.min(options.length - 1, selectedIndex + 1);
          break;
        case 'select':
          return options[selectedIndex];
        case 'quit':
          return null;
        default:
          continue;
      }
      
      // Clear previous render
      console.log('\u001b[' + (options.length + 3) + 'A');
    }
  }

  generateFilename(): string {
    const cleanTitle = this.data.title
      .replaceAll(/[^\w\s-]/g, '')
      .replaceAll(/\s+/g, '_')
      .substring(0, 50);
    
    return `${this.data.channel}_${cleanTitle}.mp4`;
  }

  async download(quality: QualityOption, filename?: string): Promise<boolean> {
    const targetFile = filename || this.generateFilename();
    
    // Check if file exists
    try {
      await access(targetFile);
      console.log(chalk.yellow(`File ${targetFile} already exists`));
      return false;
    } catch {
      // File doesn't exist, proceed with download
    }
    
    return new Promise((resolve) => {
      console.log(`${chalk.blue('Downloading')} ${chalk.white(targetFile)}`);
      ux.action.start('Progress');
      
      https.get(quality.url, (response) => {
        const fileStream = createWriteStream(targetFile);
        let downloadedBytes = 0;
        const totalBytes = parseInt(response.headers['content-length'] || '0', 10);
        
        response.pipe(fileStream);
        
        response.on('data', (chunk) => {
          downloadedBytes += chunk.length;
          if (totalBytes > 0) {
            const percent = Math.round((downloadedBytes / totalBytes) * 100);
            ux.action.status = `${percent}% (${this.formatBytes(downloadedBytes)}/${this.formatBytes(totalBytes)})`;
          } else {
            ux.action.status = this.formatBytes(downloadedBytes);
          }
        });
        
        fileStream.on('finish', () => {
          fileStream.close();
          ux.action.stop(chalk.green('✓'));
          console.log(chalk.green(`Saved as ${targetFile}`));
          resolve(true);
        });
        
        fileStream.on('error', (error) => {
          ux.action.stop(chalk.red('✗'));
          console.log(chalk.red(`Download failed: ${error.message}`));
          resolve(false);
        });
        
        response.on('error', (error) => {
          ux.action.stop(chalk.red('✗'));
          console.log(chalk.red(`Download failed: ${error.message}`));
          resolve(false);
        });
      }).on('error', (error) => {
        ux.action.stop(chalk.red('✗'));
        console.log(chalk.red(`Download failed: ${error.message}`));
        resolve(false);
      });
    });
  }

  private formatBytes(bytes: number): string {
    if (bytes === 0) return '0 B';
    
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
  }
}