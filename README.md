oclif-hello-world
=================

oclif example Hello World CLI

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
$ npm install -g mediathek
$ media COMMAND
running command...
$ media (--version)
mediathek/0.0.0 darwin-arm64 node-v16.1.0
$ media --help [COMMAND]
USAGE
  $ media COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`media hello PERSON`](#media-hello-person)
* [`media hello world`](#media-hello-world)
* [`media help [COMMAND]`](#media-help-command)
* [`media plugins`](#media-plugins)
* [`media plugins:inspect PLUGIN...`](#media-pluginsinspect-plugin)
* [`media plugins:install PLUGIN...`](#media-pluginsinstall-plugin)
* [`media plugins:link PLUGIN`](#media-pluginslink-plugin)
* [`media plugins:uninstall PLUGIN...`](#media-pluginsuninstall-plugin)
* [`media plugins update`](#media-plugins-update)

## `media hello PERSON`

Say hello

```
USAGE
  $ media hello [PERSON] -f <value>

ARGUMENTS
  PERSON  Person to say hello to

FLAGS
  -f, --from=<value>  (required) Whom is saying hello

DESCRIPTION
  Say hello

EXAMPLES
  $ oex hello friend --from oclif
  hello friend from oclif! (./src/commands/hello/index.ts)
```

_See code: [dist/commands/hello/index.ts](https://github.com/maxboettinger/oclif-mediathek/blob/v0.0.0/dist/commands/hello/index.ts)_

## `media hello world`

Say hello world

```
USAGE
  $ media hello world

DESCRIPTION
  Say hello world

EXAMPLES
  $ oex hello world
  hello world! (./src/commands/hello/world.ts)
```

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

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v5.1.11/src/commands/help.ts)_

## `media plugins`

List installed plugins.

```
USAGE
  $ media plugins [--core]

FLAGS
  --core  Show core plugins.

DESCRIPTION
  List installed plugins.

EXAMPLES
  $ media plugins
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v2.0.11/src/commands/plugins/index.ts)_

## `media plugins:inspect PLUGIN...`

Displays installation properties of a plugin.

```
USAGE
  $ media plugins:inspect PLUGIN...

ARGUMENTS
  PLUGIN  [default: .] Plugin to inspect.

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Displays installation properties of a plugin.

EXAMPLES
  $ media plugins:inspect myplugin
```

## `media plugins:install PLUGIN...`

Installs a plugin into the CLI.

```
USAGE
  $ media plugins:install PLUGIN...

ARGUMENTS
  PLUGIN  Plugin to install.

FLAGS
  -f, --force    Run yarn install with force flag.
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Installs a plugin into the CLI.

  Can be installed from npm or a git url.

  Installation of a user-installed plugin will override a core plugin.

  e.g. If you have a core plugin that has a 'hello' command, installing a user-installed plugin with a 'hello' command
  will override the core plugin implementation. This is useful if a user needs to update core plugin functionality in
  the CLI without the need to patch and update the whole CLI.

ALIASES
  $ media plugins add

EXAMPLES
  $ media plugins:install myplugin 

  $ media plugins:install https://github.com/someuser/someplugin

  $ media plugins:install someuser/someplugin
```

## `media plugins:link PLUGIN`

Links a plugin into the CLI for development.

```
USAGE
  $ media plugins:link PLUGIN

ARGUMENTS
  PATH  [default: .] path to plugin

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Links a plugin into the CLI for development.

  Installation of a linked plugin will override a user-installed or core plugin.

  e.g. If you have a user-installed or core plugin that has a 'hello' command, installing a linked plugin with a 'hello'
  command will override the user-installed or core plugin implementation. This is useful for development work.

EXAMPLES
  $ media plugins:link myplugin
```

## `media plugins:uninstall PLUGIN...`

Removes a plugin from the CLI.

```
USAGE
  $ media plugins:uninstall PLUGIN...

ARGUMENTS
  PLUGIN  plugin to uninstall

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Removes a plugin from the CLI.

ALIASES
  $ media plugins unlink
  $ media plugins remove
```

## `media plugins update`

Update installed plugins.

```
USAGE
  $ media plugins update [-h] [-v]

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Update installed plugins.
```
<!-- commandsstop -->