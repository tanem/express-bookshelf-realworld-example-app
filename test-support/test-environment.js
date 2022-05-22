'use strict';

const {TestEnvironment: NodeEnvironment} = require('jest-environment-node');

class TestEnvironment extends NodeEnvironment {
  constructor({globalConfig, projectConfig}, context) {
    super({globalConfig, projectConfig}, context);
  }

  async setup() {
    await super.setup();

    // Ensure the same knex instance is used between test support code and the
    // app under test, that way we don't end up with multiple DB connection
    // pools that we have to clean up.
    this.global.__KNEX_TEST__ = global.__KNEX_TEST__;
  }

  async teardown() {
    await super.teardown();
  }

  runScript(script) {
    return super.runScript(script);
  }
}

module.exports = TestEnvironment;
