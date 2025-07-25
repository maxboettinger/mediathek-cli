import chalk from 'chalk';
import Table from 'cli-table3';
import moment from 'moment';

import type {ApiResponse, MediaEntry} from '../types';

const {log} = console;

export function drawTable(
  apiResponse: ApiResponse,
  pagination: number,
  limit: number,
): void {
  // check if pagination exceeds result count
  if (pagination * limit >= apiResponse.queryInfo.totalResults) {
    log('Requested page #'
    	+ chalk.bold(pagination)
    	+ ' with '
    	+ chalk.bold((pagination * limit) + '-' + ((pagination * limit) + (limit - 1)))
    	+ ' of '
    	+ chalk.bold(apiResponse.queryInfo.totalResults)
    	+ ' results found in '
    	+ chalk.bold(apiResponse.queryInfo.searchEngineTime)
    	+ 'ms');

    log('');
    log(chalk.bold.red('pagination exceeds result count!'));
    log('');

    return;
  }

  log('Showing page #'
  	+ chalk.bold(pagination)
  	+ ' with '
  	+ chalk.bold((pagination * limit) + '-' + ((pagination * limit) + (limit - 1)))
  	+ ' of '
  	+ chalk.bold(apiResponse.queryInfo.totalResults)
  	+ ' results found in '
  	+ chalk.bold(apiResponse.queryInfo.searchEngineTime)
  	+ 'ms');
  log('');

  const table = new Table({
    colWidths: [5, 10, 20, 50, 17, 8],
    head: ['ID', 'Channel', 'Topic', 'Title', 'Published', 'Duration'],
  });

  for (const [index, row] of apiResponse.results.entries()) {
    table.push([
      (index + (pagination * limit)).toString(),
      row.channel,
      row.topic,
      row.title,
      moment(row.timestamp, 'X').format('DD.MM.YYYY HH:mm'),
      (row.duration / 60).toFixed(2) + 'm',
    ]);
  }

  log(table.toString());

  log('');
  log('use '
  	+ chalk.bold.italic('media detail {ID}')
  	+ ' to view detailed information for an entry');
  log('add '
  	+ chalk.bold.italic('-p {desired page}')
  	+ ' to your last query in order to use pagination');
  log('');
}

export function showDetail(element: MediaEntry): void {
  log('\n' + chalk.bold.underline(element.title));

  log('From '
  	+ chalk.white.bold(element.topic)
  	+ ' in '
  	+ chalk.white.bold(element.channel)
  	+ ' published '
  	+ chalk.bold.white(moment(element.timestamp, 'X').format('DD.MM.YYYY HH:mm'))
  	+ ' duration: '
  	+ chalk.bold.white((element.duration / 60).toFixed(2) + 'm'));

  log('\n' + chalk.gray.italic(element.description));
  console.log();

  log('Web: ' + chalk.gray(element.url_website));
  log('SD: ' + chalk.gray(element.url_video_low));
  log('HD: ' + chalk.gray(element.url_video));
  log('FHD: ' + chalk.gray(element.url_video_hd));

  console.log('\n');
}
