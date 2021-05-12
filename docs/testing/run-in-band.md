# Run in Band

Since we're hitting a real DB via our functional tests, we want to run them serially in the current process using Jest's [`runInBand`](https://facebook.github.io/jest/docs/en/cli.html#runinband) option so they remain isolated. If the test suite gets expanded to include unit tests that don't hit the DB for example, then we may want to be specific about when we use that flag in order to keep the tests running as fast as possible.
