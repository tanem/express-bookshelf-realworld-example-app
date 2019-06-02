# express-bookshelf-realworld-example-app

[![build status](https://img.shields.io/travis/tanem/express-bookshelf-realworld-example-app/master.svg?style=flat-square)](https://travis-ci.org/tanem/express-bookshelf-realworld-example-app)
[![coverage status](https://img.shields.io/coveralls/tanem/express-bookshelf-realworld-example-app.svg?style=flat-square)](https://coveralls.io/r/tanem/express-bookshelf-realworld-example-app)

> An [Express](https://expressjs.com/) and [Bookshelf](http://bookshelfjs.org/) based backend implementation of the [RealWorld API Spec](https://github.com/gothinkster/realworld/tree/master/api).

## Table of Contents

* [Background](#background)
* [Getting Started](#getting-started)
* [Running Tests](#running-tests)
* [Documentation](#documentation)
* [License](#license)

## Background

This project was created in order to familiarise myself with some key technologies in use at my day job. It's not intended to be production ready, but PRs that address this and any other issues are welcome!

## Getting Started

Ensure [Docker Compose](https://docs.docker.com/compose/install/) is installed, then:

1.  Clone this repo.
2.  Change to the above dir.
3.  Run `npm run docker:start` to start the app.

## Running Tests

Run the full test suite with:

```
$ npm run docker:test
```

CLI args will be passed through to Jest. For example, to run in watch mode:

```
$ npm run docker:test --watch
```

This project also passes the [realworld-server-tester](https://github.com/agrison/realworld-server-tester) test suite. First start the server:

```
$ npm run docker:start
```

Then in a new terminal window, assuming you've cloned the `realworld-server-tester` repo and changed to the correct directory, run:

```
$ java -jar target/realworld-server-tester-0.1.0-SNAPSHOT-standalone.jar http://localhost:3000/api
```

## Documentation

- [Docs](/docs/)

## License

MIT