# express-bookshelf-realworld-example-app

[![build status](https://img.shields.io/travis/tanem/express-bookshelf-realworld-example-app/master.svg?style=flat-square)](https://travis-ci.org/tanem/express-bookshelf-realworld-example-app)
[![coverage status](https://img.shields.io/coveralls/tanem/express-bookshelf-realworld-example-app.svg?style=flat-square)](https://coveralls.io/r/tanem/express-bookshelf-realworld-example-app)

> An Express and Bookshelf based backend implementation of the [RealWorld API Spec](https://github.com/gothinkster/realworld/tree/master/api).

## table of contents

- [getting started](#getting-started)
  - [prerequisites](#prerequisites)
  - [steps](#steps)
- [implementation details](#implementation-details)
  - [structure](#structure)
    - [group by coupling](#group-by-coupling)
    - [initializers](#initializers)
  - [configuration](#configuration)
  - [testing](#testing)
    - [outside in](#outside-in)
    - [run in band](#run-in-band)
    - [prefer snapshot tests](#prefer-snapshot-tests)

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
      "database": "realworld_development",
      "user": "realworld",
      "password": "password"
    }
  }
}
```

7. Run `NODE_ENV=development yarn knex migrate:latest` to update the schema.
8. Create a database for the `test` environment.
9. Create a `src/config/test.json` configuration file containing the required database information from the previous step (note that the migrations are run automatically as part of the test setup process). For example:

```json 
{
  "db": {
    "connection": {
      "database": "realworld_test",
      "user": "realworld",
      "password": "password"
    }
  }
}
```

11. Run `yarn start`.

## implementation details

High-level overview of some key decisions made building the app. Often there is more detail in the related code comments, so it's worth checking those out too.

### structure

#### group by coupling

The general rule with modules in the `lib/` dir is "things that change together, stay together". This is largely a personal preference after having to maintain apps that instead group by function, but the approach is also summarised nicely in this [express code structure](https://github.com/focusaurus/express_code_structure) example.

Each module is usually an Express sub-app. Code that is shared across modules is either promoted (e.g. middleware), or is added to a specific app-wide registry (e.g. models).

#### initializers

The initialization procedure is based on [the approach taken by the Locomotive framework]((http://www.locomotivejs.org/guide/initialization/). App initialization steps have been split into seperate functions in
the `initializers/` folder, and are run in a certain order. Any required app-wide references are set on the [`app.locals`](https://expressjs.com/en/4x/api.html#app.locals) object.

### configuration

Configuration is handled by [node-convict](https://github.com/mozilla/node-convict), which provides context on each setting and enables validation and early failures for when the configuration is wrong.

Some values are required, and there are also some defaults which can be overridden if required. You can do this via environment-specific configuration files, for example `development.json` and `test.json`. Environment variables are also respected, see [precedence order](https://github.com/mozilla/node-convict#precendence-order) for more information.

### testing

#### [outside-in](https://robots.thoughtbot.com/testing-from-the-outsidein)

The preference is to create high-level tests first in order to test the API end-to-end from a user’s perspective. From there we can drop down into lower-level tests like unit tests (this hasn't yet been done in this repo).

#### run in band

Since we're hitting a real DB via our functional tests, we want to run them serially in the current process using Jest's [`runInBand`](https://facebook.github.io/jest/docs/en/cli.html#runinband) option. If the test suite gets expanded to include unit tests that don't hit the DB for example, then we may want to be specific about when we use that flag in order to keep the tests running as fast as possible.

#### prefer snapshot tests

Where possible Jest's [snapshot testing](https://facebook.github.io/jest/docs/en/snapshot-testing.html) feature is used in order to validate key parts of the API response. Where this is not straightforward, for example when the response returns creation dates which vary over time, we've fallen back to more specific assertions.
