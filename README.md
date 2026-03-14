# express-bookshelf-realworld-example-app

[![build status](https://img.shields.io/github/actions/workflow/status/tanem/express-bookshelf-realworld-example-app/ci.yml?branch=master&style=flat-square)](https://github.com/tanem/express-bookshelf-realworld-example-app/actions?query=workflow%3ACI)
[![coverage status](https://img.shields.io/codecov/c/github/tanem/express-bookshelf-realworld-example-app.svg?style=flat-square)](https://codecov.io/gh/tanem/express-bookshelf-realworld-example-app)

> An [Express](https://expressjs.com/) and [Bookshelf](http://bookshelfjs.org/) based backend implementation of the [RealWorld API Spec](https://github.com/gothinkster/realworld/tree/master/api).

> **Note:** Bookshelf.js is in maintenance mode (last release ~2020). This repo remains a Bookshelf reference implementation for the [RealWorld](https://github.com/gothinkster/realworld) community. For new projects, consider [Objection.js](https://vincit.github.io/objection.js/) (same Knex foundation, actively maintained), raw [Knex](https://knexjs.org/), or [Prisma](https://www.prisma.io/).

## Table of Contents

- [Background](#background)
- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
- [Running Tests](#running-tests)
- [Documentation](#documentation)
- [License](#license)

## Background

This project was created in order to familiarise myself with some key technologies in use at my day job. It's not intended to be production ready, but PRs that address this and any other issues are welcome!

## Prerequisites

- [Node.js](https://nodejs.org/) >= 22
- [Docker](https://www.docker.com/) and [Docker Compose](https://docs.docker.com/compose/install/)

## Getting Started

Ensure [Docker Compose](https://docs.docker.com/compose/install/) is installed, then:

1.  Clone this repo.
2.  Change to the above dir.
3.  Copy `.env.example` to `.env` and adjust values as needed.
4.  Run `npm run docker:start` to start the app.

## Running Tests

Run the full test suite with:

```
$ npm run docker:test
```

CLI args will be passed through to Jest. For example, to run in watch mode:

```
$ npm run docker:test -- --watch
```

## Documentation

- [Docs](/docs/)

## License

MIT
