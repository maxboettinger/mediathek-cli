export interface MediaEntry {
  channel: string;
  description: string;
  duration: number;
  localId?: number;
  timestamp: string;
  title: string;
  topic: string;
  url_video: string;
  url_video_hd: string;
  url_video_low: string;
  url_website: string;
}

export interface QueryField {
  fields: string[];
  query: string;
}

export interface ApiQuery {
  durationMax: number;
  durationMin: number;
  future: boolean;
  offset: number;
  queries: QueryField[];
  size: number;
  sortBy: 'duration' | 'timestamp';
  sortOrder: 'asc' | 'desc';
}

export interface QueryInfo {
  searchEngineTime: string;
  totalResults: number;
}

export interface ApiResponse {
  queryInfo: QueryInfo;
  results: MediaEntry[];
}

export interface CacheConfig {
  pathDownload: string;
}

export interface CacheData {
  config: CacheConfig;
  history: MediaEntry[];
}

export interface QueryFlags {
  channel?: string;
  dmax: number;
  dmin: number;
  future: boolean;
  limit: number;
  page: number;
  sortBy: 'duration' | 'timestamp';
  sortOrder: 'asc' | 'desc';
  title?: string;
  topic?: string;
}

export interface QueryArgs {
  query: string;
}

export interface DetailArgs {
  id: number;
}

export interface DownloadArgs {
  id: number;
}

export interface SearchContext {
  flags: QueryFlags;
  args: QueryArgs;
}
