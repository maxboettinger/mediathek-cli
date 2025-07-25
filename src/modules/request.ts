import {ux} from '@oclif/core';
import axios, {isAxiosError} from 'axios';
import chalk from 'chalk';
import fs from 'node:fs';
import https from 'node:https';

import type {ApiQuery, ApiResponse, MediaEntry} from '../types';

const API_URL = 'https://mediathekviewweb.de/api/query';

export async function queryApi(query: ApiQuery): Promise<ApiResponse> {
  try {
    const {data} = await axios({
      data: JSON.stringify(query),
      headers: {'Content-Type': 'text/plain'},
      method: 'post',
      url: API_URL,
    });

    return data.result;
  } catch (error) {
    if (isAxiosError(error)) {
      console.error(new Error('Unable to make request'));
      throw error;
    } else {
      throw error;
    }
  }
}

export function downloadFile(
  downloadPath: string,
  itemDetail: MediaEntry,
): Promise<boolean> {
  return new Promise((resolve, reject) => {
    ux.action.start('downloading');

    https.get(itemDetail.url_video_hd, res => {
      const writeStream = fs.createWriteStream(downloadPath);

      res.pipe(writeStream);

      writeStream.on('finish', () => {
        writeStream.close();
        ux.action.stop('done!');
        console.log('\nsaved as ' + chalk.bold(downloadPath) + '\n');
        resolve(true);
      });

      writeStream.on('error', error => {
        reject(error);
      });

      res.on('error', error => {
        reject(error);
      });
    });
  });
}
