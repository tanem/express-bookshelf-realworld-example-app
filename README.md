# [wip] conduit-node-server

My take on [Thinkster's Node.js JSON API tutorial](https://thinkster.io/tutorials/node-json-api).

## table of contents

- [getting started](#getting-started)
  - [prerequisites](#prerequisites)
  - [steps](#steps)
- [implementation details](#implementation-details)
  - [configuration](#configuration)
  - [no orm?](#no-orm)

## getting started

### prerequisites

1. [Node Version Manager](https://github.com/creationix/nvm).
2. [Yarn](https://yarnpkg.com/en/).
3. [PostgreSQL](https://www.postgresql.org/).

### steps

1. Clone this repo.
2. Change to the above dir.
3. Run `nvm i` to install and use the correct Node.js version.
4. Run `yarn` to install the required dependencies.
5. Create a database for the `development` environment.
6. Create a `src/config/development.json` configuration file containing the required database information from the previous step. For example:

  ```json
  {
    "db": {
      "connection": {
        "database": "conduit_development",
        "user": "conduit",
        "password": "password"
      }
    }
  }
  ```

7. Create a database for the `test` environment.
8. Create a `src/config/test.json` configuration file containing the required database information from the previous step. For example:

  ```json 
  {
    "db": {
      "connection": {
        "database": "conduit_test",
        "user": "conduit",
        "password": "password"
      }
    }
  }
  ```

  9. Run `yarn start`.

## implementation details

### configuration

Configuration is handled by [node-convict](https://github.com/mozilla/node-convict), which provides context on each setting and enables validation and early failures for when the configuration is wrong.

Some values are required, and there are also some defaults which can be overridden if required. You can do this via environment-specific configuration files, for example `development.json` and `test.json`. Environment variables are also respected, see [precedence order](https://github.com/mozilla/node-convict#precendence-order) for more information.

### no orm?

Nope, not yet anyway. Mainly because I've fought too much with them in the past, and on this project I don't think I need to go there. I like [Knex](http://knexjs.org/) as a query builder though, so that's included.