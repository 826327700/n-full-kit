n-full-cli
=================

A new CLI generated with oclif


[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/n-full-cli.svg)](https://npmjs.org/package/n-full-cli)
[![Downloads/week](https://img.shields.io/npm/dw/n-full-cli.svg)](https://npmjs.org/package/n-full-cli)


<!-- toc -->
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->
# Usage
<!-- usage -->
```sh-session
$ npm install -g n-full-cli
$ n-full-cli COMMAND
running command...
$ n-full-cli (--version)
n-full-cli/0.0.0 darwin-arm64 node-v18.20.5
$ n-full-cli --help [COMMAND]
USAGE
  $ n-full-cli COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`n-full-cli hello PERSON`](#n-full-cli-hello-person)
* [`n-full-cli hello world`](#n-full-cli-hello-world)
* [`n-full-cli help [COMMAND]`](#n-full-cli-help-command)
* [`n-full-cli plugins`](#n-full-cli-plugins)
* [`n-full-cli plugins add PLUGIN`](#n-full-cli-plugins-add-plugin)
* [`n-full-cli plugins:inspect PLUGIN...`](#n-full-cli-pluginsinspect-plugin)
* [`n-full-cli plugins install PLUGIN`](#n-full-cli-plugins-install-plugin)
* [`n-full-cli plugins link PATH`](#n-full-cli-plugins-link-path)
* [`n-full-cli plugins remove [PLUGIN]`](#n-full-cli-plugins-remove-plugin)
* [`n-full-cli plugins reset`](#n-full-cli-plugins-reset)
* [`n-full-cli plugins uninstall [PLUGIN]`](#n-full-cli-plugins-uninstall-plugin)
* [`n-full-cli plugins unlink [PLUGIN]`](#n-full-cli-plugins-unlink-plugin)
* [`n-full-cli plugins update`](#n-full-cli-plugins-update)

## `n-full-cli hello PERSON`

Say hello

```
USAGE
  $ n-full-cli hello PERSON -f <value>

ARGUMENTS
  PERSON  Person to say hello to

FLAGS
  -f, --from=<value>  (required) Who is saying hello

DESCRIPTION
  Say hello

EXAMPLES
  $ n-full-cli hello friend --from oclif
  hello friend from oclif! (./src/commands/hello/index.ts)
```

_See code: [src/commands/hello/index.ts](https://github.com/n-full-kit/n-full-cli/blob/v0.0.0/src/commands/hello/index.ts)_

## `n-full-cli hello world`

Say hello world

```
USAGE
  $ n-full-cli hello world

DESCRIPTION
  Say hello world

EXAMPLES
  $ n-full-cli hello world
  hello world! (./src/commands/hello/world.ts)
```

_See code: [src/commands/hello/world.ts](https://github.com/n-full-kit/n-full-cli/blob/v0.0.0/src/commands/hello/world.ts)_

## `n-full-cli help [COMMAND]`

Display help for n-full-cli.

```
USAGE
  $ n-full-cli help [COMMAND...] [-n]

ARGUMENTS
  COMMAND...  Command to show help for.

FLAGS
  -n, --nested-commands  Include all nested commands in the output.

DESCRIPTION
  Display help for n-full-cli.
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v6.2.19/src/commands/help.ts)_

## `n-full-cli plugins`

List installed plugins.

```
USAGE
  $ n-full-cli plugins [--json] [--core]

FLAGS
  --core  Show core plugins.

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  List installed plugins.

EXAMPLES
  $ n-full-cli plugins
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v5.4.22/src/commands/plugins/index.ts)_

## `n-full-cli plugins add PLUGIN`

Installs a plugin into n-full-cli.

```
USAGE
  $ n-full-cli plugins add PLUGIN... [--json] [-f] [-h] [-s | -v]

ARGUMENTS
  PLUGIN...  Plugin to install.

FLAGS
  -f, --force    Force npm to fetch remote resources even if a local copy exists on disk.
  -h, --help     Show CLI help.
  -s, --silent   Silences npm output.
  -v, --verbose  Show verbose npm output.

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Installs a plugin into n-full-cli.

  Uses npm to install plugins.

  Installation of a user-installed plugin will override a core plugin.

  Use the N_FULL_CLI_NPM_LOG_LEVEL environment variable to set the npm loglevel.
  Use the N_FULL_CLI_NPM_REGISTRY environment variable to set the npm registry.

ALIASES
  $ n-full-cli plugins add

EXAMPLES
  Install a plugin from npm registry.

    $ n-full-cli plugins add myplugin

  Install a plugin from a github url.

    $ n-full-cli plugins add https://github.com/someuser/someplugin

  Install a plugin from a github slug.

    $ n-full-cli plugins add someuser/someplugin
```

## `n-full-cli plugins:inspect PLUGIN...`

Displays installation properties of a plugin.

```
USAGE
  $ n-full-cli plugins inspect PLUGIN...

ARGUMENTS
  PLUGIN...  [default: .] Plugin to inspect.

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Displays installation properties of a plugin.

EXAMPLES
  $ n-full-cli plugins inspect myplugin
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v5.4.22/src/commands/plugins/inspect.ts)_

## `n-full-cli plugins install PLUGIN`

Installs a plugin into n-full-cli.

```
USAGE
  $ n-full-cli plugins install PLUGIN... [--json] [-f] [-h] [-s | -v]

ARGUMENTS
  PLUGIN...  Plugin to install.

FLAGS
  -f, --force    Force npm to fetch remote resources even if a local copy exists on disk.
  -h, --help     Show CLI help.
  -s, --silent   Silences npm output.
  -v, --verbose  Show verbose npm output.

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Installs a plugin into n-full-cli.

  Uses npm to install plugins.

  Installation of a user-installed plugin will override a core plugin.

  Use the N_FULL_CLI_NPM_LOG_LEVEL environment variable to set the npm loglevel.
  Use the N_FULL_CLI_NPM_REGISTRY environment variable to set the npm registry.

ALIASES
  $ n-full-cli plugins add

EXAMPLES
  Install a plugin from npm registry.

    $ n-full-cli plugins install myplugin

  Install a plugin from a github url.

    $ n-full-cli plugins install https://github.com/someuser/someplugin

  Install a plugin from a github slug.

    $ n-full-cli plugins install someuser/someplugin
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v5.4.22/src/commands/plugins/install.ts)_

## `n-full-cli plugins link PATH`

Links a plugin into the CLI for development.

```
USAGE
  $ n-full-cli plugins link PATH [-h] [--install] [-v]

ARGUMENTS
  PATH  [default: .] path to plugin

FLAGS
  -h, --help          Show CLI help.
  -v, --verbose
      --[no-]install  Install dependencies after linking the plugin.

DESCRIPTION
  Links a plugin into the CLI for development.

  Installation of a linked plugin will override a user-installed or core plugin.

  e.g. If you have a user-installed or core plugin that has a 'hello' command, installing a linked plugin with a 'hello'
  command will override the user-installed or core plugin implementation. This is useful for development work.


EXAMPLES
  $ n-full-cli plugins link myplugin
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v5.4.22/src/commands/plugins/link.ts)_

## `n-full-cli plugins remove [PLUGIN]`

Removes a plugin from the CLI.

```
USAGE
  $ n-full-cli plugins remove [PLUGIN...] [-h] [-v]

ARGUMENTS
  PLUGIN...  plugin to uninstall

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Removes a plugin from the CLI.

ALIASES
  $ n-full-cli plugins unlink
  $ n-full-cli plugins remove

EXAMPLES
  $ n-full-cli plugins remove myplugin
```

## `n-full-cli plugins reset`

Remove all user-installed and linked plugins.

```
USAGE
  $ n-full-cli plugins reset [--hard] [--reinstall]

FLAGS
  --hard       Delete node_modules and package manager related files in addition to uninstalling plugins.
  --reinstall  Reinstall all plugins after uninstalling.
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v5.4.22/src/commands/plugins/reset.ts)_

## `n-full-cli plugins uninstall [PLUGIN]`

Removes a plugin from the CLI.

```
USAGE
  $ n-full-cli plugins uninstall [PLUGIN...] [-h] [-v]

ARGUMENTS
  PLUGIN...  plugin to uninstall

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Removes a plugin from the CLI.

ALIASES
  $ n-full-cli plugins unlink
  $ n-full-cli plugins remove

EXAMPLES
  $ n-full-cli plugins uninstall myplugin
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v5.4.22/src/commands/plugins/uninstall.ts)_

## `n-full-cli plugins unlink [PLUGIN]`

Removes a plugin from the CLI.

```
USAGE
  $ n-full-cli plugins unlink [PLUGIN...] [-h] [-v]

ARGUMENTS
  PLUGIN...  plugin to uninstall

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Removes a plugin from the CLI.

ALIASES
  $ n-full-cli plugins unlink
  $ n-full-cli plugins remove

EXAMPLES
  $ n-full-cli plugins unlink myplugin
```

## `n-full-cli plugins update`

Update installed plugins.

```
USAGE
  $ n-full-cli plugins update [-h] [-v]

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Update installed plugins.
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v5.4.22/src/commands/plugins/update.ts)_
<!-- commandsstop -->
