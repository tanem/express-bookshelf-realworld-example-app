const path = require('path');
const convict = require('convict');

const config = convict({
  env: {
    doc: 'The application environment.',
    format: ['development', 'test', 'production'],
    default: 'development',
    env: 'NODE_ENV',
  },
  ip: {
    doc: 'The IP address to bind.',
    format: 'ipaddress',
    default: '127.0.0.1',
    env: 'IP_ADDRESS',
  },
  port: {
    doc: 'The port to bind.',
    format: 'port',
    default: 3000,
    env: 'PORT',
  },
  pino: {
    level: {
      doc: 'Pino log level',
      format: ['fatal', 'error', 'warn', 'info', 'debug', 'trace', 'silent'],
      default: 'info',
      env: 'PINO_LEVEL',
    },
  },
  db: {
    debug: {
      doc: 'Debug database queries',
      format: Boolean,
      default: false,
      env: 'DB_DEBUG',
    },
    client: 'pg',
    connection: {
      host: {
        doc: 'Database host name/IP',
        format: '*',
        default: '127.0.0.1',
        env: 'DB_HOST',
      },
      port: {
        doc: 'Database port',
        format: 'port',
        default: 5432,
        env: 'DB_PORT',
      },
      database: {
        doc: 'Database name',
        format: String,
        default: null,
        env: 'DB_NAME',
      },
      user: {
        doc: 'Database user',
        format: String,
        default: null,
        env: 'DB_USER',
      },
      password: {
        doc: 'Database password',
        format: String,
        default: null,
        sensitive: true,
        env: 'DB_PASSWORD',
      },
    },
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      tableName: 'knex_migrations',
      directory: path.resolve(__dirname, '../migrations'),
    },
  },
  secret: {
    doc: 'JWT secret',
    format: String,
    default: null,
    sensitive: true,
    env: 'SECRET',
  },
});

config.loadFile(path.join(__dirname, `${config.get('env')}.json`));
config.validate({allowed: 'strict'});

module.exports = config;
