# conduit-node-server

_WIP_

> My take on [Thinkster's Node.js JSON API tutorial](https://thinkster.io/tutorials/node-json-api).

## setup

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
6. Create a `src/config/development.json` configuration file containing the required databse information from the previous step. For example:

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
8. Create a `src/config/test.json` configuration file containing the required databse information from the previous step. For example:

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
