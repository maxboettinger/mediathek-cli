mediathek-cli
=================

an (under development!) CLI for querying the awesome [MediathekViewWeb](https://github.com/mediathekview/mediathekviewweb) project.

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/oclif-hello-world.svg)](https://npmjs.org/package/oclif-hello-world)
[![CircleCI](https://circleci.com/gh/oclif/hello-world/tree/main.svg?style=shield)](https://circleci.com/gh/oclif/hello-world/tree/main)
[![Downloads/week](https://img.shields.io/npm/dw/oclif-hello-world.svg)](https://npmjs.org/package/oclif-hello-world)
[![License](https://img.shields.io/npm/l/oclif-hello-world.svg)](https://github.com/oclif/hello-world/blob/main/package.json)

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
mediathek-cli/0.1.0 linux-x64 node-v16.10.0
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
* [`media query`](#media-query)

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

_See code: [dist/commands/detail.ts](https://github.com/maxboettinger/mediathek-cli/blob/v0.1.0/dist/commands/detail.ts)_

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

## `media query`

query the mediathek

```
USAGE
  $ media query [-t <value>] [-s <value>] [-c <value>] [-l <value>] [-p <value>] [--dmin <value>] [--dmax
    <value>] [--sortBy timestamp|duration] [--sortOrder desc|asc] [--future]

FLAGS
  -c, --channel=<value>  channel to query
  -l, --limit=<value>    [default: 15] limit amounts of displayed results
  -p, --page=<value>     use pagination for last query
  -s, --topic=<value>    topic (sendung) to query
  -t, --title=<value>    title to query
  --dmax=<value>         [default: 99999] maximum duration (in minutes)
  --dmin=<value>         minimum duration (in minutes)
  --future               choose to allow future shows to be included in results
  --sortBy=<option>      [default: timestamp] define the parameter for sorting. Supported: timestamp; duration
                         <options: timestamp|duration>
  --sortOrder=<option>   [default: desc] define the sorting order
                         <options: desc|asc>

DESCRIPTION
  query the mediathek

EXAMPLES
  $ media query
```

_See code: [dist/commands/query.ts](https://github.com/maxboettinger/mediathek-cli/blob/v0.1.0/dist/commands/query.ts)_
<!-- commandsstop -->
