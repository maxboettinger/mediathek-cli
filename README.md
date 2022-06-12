mediathek-cli
=================

an (under development!) CLI for querying the awesome [MediathekViewWeb](https://github.com/mediathekview/mediathekviewweb) project.

[![Version](https://img.shields.io/npm/v/oclif-hello-world.svg)](https://www.npmjs.com/package/mediathek-cli)
[![Downloads/week](https://img.shields.io/npm/dw/oclif-hello-world.svg)](https://www.npmjs.com/package/mediathek-cli)
[![License](https://img.shields.io/npm/l/oclif-hello-world.svg)](https://github.com/maxboettinger/mediathek-cli/blob/master/package.json)

<!-- toc -->
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->
# Usage
<!-- usage -->
```sh-session
$ npm install -g mediathek-cli
$ media COMMAND
running command...
$ media (--version)
mediathek-cli/0.2.0 linux-x64 node-v16.10.0
$ media --help [COMMAND]
USAGE
  $ media COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`media detail [ID]`](#media-detail-id)
* [`media help [COMMAND]`](#media-help-command)
* [`media query QUERY`](#media-query-query)

## `media detail [ID]`

show detailed information for a specific mediathek entry

```
USAGE
  $ media detail [ID]

DESCRIPTION
  show detailed information for a specific mediathek entry

EXAMPLES
  $ media detail
```

_See code: [dist/commands/detail.ts](https://github.com/maxboettinger/mediathek-cli/blob/v0.2.0/dist/commands/detail.ts)_

## `media help [COMMAND]`

Display help for media.

```
USAGE
  $ media help [COMMAND] [-n]

ARGUMENTS
  COMMAND  Command to show help for.

FLAGS
  -n, --nested-commands  Include all nested commands in the output.

DESCRIPTION
  Display help for media.
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v5.1.12/src/commands/help.ts)_

## `media query QUERY`

query the mediathek

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

DESCRIPTION
  query the mediathek

EXAMPLES
  $ media query
```

_See code: [dist/commands/query.ts](https://github.com/maxboettinger/mediathek-cli/blob/v0.2.0/dist/commands/query.ts)_
<!-- commandsstop -->
