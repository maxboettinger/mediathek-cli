mediathek-cli
=================
[![Version](https://img.shields.io/npm/v/mediathek-cli.svg)](https://www.npmjs.com/package/mediathek-cli)
[![Downloads/week](https://img.shields.io/npm/dw/mediathek-cli.svg)](https://www.npmjs.com/package/mediathek-cli)
[![License](https://img.shields.io/npm/l/mediathek-cli.svg)](https://github.com/maxboettinger/mediathek-cli/blob/master/package.json)

an (under development!) CLI for querying the awesome [MediathekViewWeb](https://github.com/mediathekview/mediathekviewweb) project.


# Quickstart

There are currently *2* supported commands (```media query``` and ```media detail```). These are meant to be used in *succession*, as ```media detail``` requires a specific *entry id* optained from your last query.

### $ media query {query}
This command allows to query the [MediathekViewWeb](https://github.com/mediathekview/mediathekviewweb) database. It supports similar filters which are implemented as optional flags.

![MediathekViewWeb](https://abload.de/img/carbon12fjay.png)

The most basic query only requires a string, describing what you are searching for: ```media query "tagesschau"```.
More specific searches can be achieved by using flags.

```
USAGE
  $ media query [QUERY] [-t <value>] [-s <value>] [-c <value>] [-l <value>] [-p <value>] [--dmin <value>]
    [--dmax <value>] [--sortBy timestamp|duration] [--sortOrder desc|asc] [--future]

ARGUMENTS
  QUERY  :string - describe what you are searching for

FLAGS
  -c, --channel=<value>  :string - limit search to a specific channel [e.g. 'ARD']
  -l, --limit=<value>    [default: 15] :number - limit search results
  -p, --page=<value>     :number - use pagination to view specific result page
  -s, --topic=<value>    :string - search for a specific topic (Sendung) [e.g. 'tagesschau']
  -t, --title=<value>    :string - search for a specific title [e.g. 'Wetten dass...']
  --dmax=<value>         [default: 99999] :number - maximum duration (in minutes)
  --dmin=<value>         :number - minimum duration (in minutes)
  --future               :bool - choose to allow results of future entries
  --sortBy=<option>      [default: timestamp] :string - define what to sort by
                         <options: timestamp|duration>
  --sortOrder=<option>   [default: desc] :string - define sorting order
                         <options: desc|asc>
```

### $ media detail {entry id}
This command allows to view more information for a single entry. It requires the respective  *media id*, which is displayed for every result of ```media query```.

![MediathekViewWeb](https://abload.de/img/carbon2yxksl.png)

```
USAGE
  $ media detail [ID]

ARGUMENTS
  ID  :number - the respective Entry ID of the last query to show details for

DESCRIPTION
  show detailed information for a specific mediathek entry

EXAMPLES
  $ media detail 4
```



# Setup

```sh-session
$ npm install -g mediathek-cli
$ media COMMAND
running command...
$ media (--version)
mediathek-cli/0.3.0 linux-x64 node-v16.10.0
$ media --help [COMMAND]
USAGE
  $ media COMMAND
...
```


# Roadmap
- add support for downloading media
- overhaul inspection of a single result
