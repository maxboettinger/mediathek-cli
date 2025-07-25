import {existsSync, mkdirSync} from 'node:fs';
import fs from 'node:fs/promises';

import type {ApiResponse, CacheData, MediaEntry} from '../types';

const CACHE_FILE = '/.mediathek_cli.json';

const defaultCacheData: CacheData = {
  config: {
    pathDownload: '',
  },
  history: [],
};

export async function saveHistory(
  data: ApiResponse,
  page: number,
  limit: number,
  cacheDir: string,
): Promise<boolean> {
  try {
    const tempList = data.results;

    // append entry id's to results
    for (const [i, element] of tempList.entries()) {
      element.localId = i + (page * limit);
    }

    const cacheData: CacheData = {
      ...defaultCacheData,
      history: tempList,
    };

    // Create cache directory if it doesn't exist
    if (!existsSync(cacheDir)) {
      mkdirSync(cacheDir, {recursive: true});
    }

    await fs.writeFile(cacheDir + CACHE_FILE, JSON.stringify(cacheData));
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
}

export async function loadHistory(id: number, cacheDir: string): Promise<MediaEntry> {
  try {
    const jsonData = await fs.readFile(cacheDir + CACHE_FILE, 'utf8');
    const parsedData: CacheData = JSON.parse(jsonData);

    const entry = parsedData.history.find(item => item.localId === id);

    if (!entry) {
      throw new Error(`No entry found for provided entry id (${id})`);
    }

    return entry;
  } catch (error) {
    console.error(`No entry found for provided entry id (${id})`);
    throw error;
  }
}
