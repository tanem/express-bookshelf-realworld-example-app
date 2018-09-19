# Configuration

Configuration is handled by [node-convict](https://github.com/mozilla/node-convict), which provides context on each setting and enables validation and early failures for when the configuration is wrong.

Some values are required, and there are also some defaults which can be overridden if required. You can do this via environment-specific configuration files, for example `development.json` and `test.json`. Environment variables are also respected, see [precedence order](https://github.com/mozilla/node-convict#precendence-order) for more information.
