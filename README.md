# express-bookshelf-realworld-example-app

[![build status](https://img.shields.io/github/workflow/status/tanem/express-bookshelf-realworld-example-app/CI?style=flat-square)](https://github.com/tanem/express-bookshelf-realworld-example-app/actions?query=workflow%3ACI)
[![coverage status](https://img.shields.io/codecov/c/github/tanem/express-bookshelf-realworld-example-app.svg?style=flat-square)](https://codecov.io/gh/tanem/express-bookshelf-realworld-example-app)

> An [Express](https://expressjs.com/) and [Bookshelf](http://bookshelfjs.org/) based backend implementation of the [RealWorld API Spec](https://github.com/gothinkster/realworld/tree/master/api).

## Table of Contents

- [Background](#background)
- [Getting Started](#getting-started)
- [Running Tests](#running-tests)
- [Documentation](#documentation)
- [License](#license)

## Background

This project was created in order to familiarise myself with some key technologies in use at my day job. It's not intended to be production ready, but PRs that address this and any other issues are welcome!

## Getting Started

Ensure you have a local Postgres Instance up and running.

1.  Clone this repo.
2.  Inside /config/index.js , do the followings :
    a. Enter string secret value.
    b. Enter database, user and password.
3.  Run `npm run start` to start the app.

## Running Tests

Run the full test suite with:

```
$ npm run test
```

CLI args will be passed through to Jest. For example, to run in watch mode:

```
$ npm run test --watch
```

This project also passes the [realworld-server-tester](https://github.com/agrison/realworld-server-tester) test suite. First start the server:

```
$ npm run start
```

Then in a new terminal window, assuming you've cloned the `realworld-server-tester` repo and changed to the correct directory, run:

```
$ java -jar target/realworld-server-tester-0.1.0-SNAPSHOT-standalone.jar http://localhost:3000/api
```

## Documentation

- [Docs](/docs/)

## License
I do not own any liscence for this. I have no ownership or copywrite on this repo. I have cloned the repo from "https://github.com/tanem/express-bookshelf-realworld-example-app" and made changes as per my requisites.

