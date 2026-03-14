# Prefer Snapshot Tests

Where possible Jest's [snapshot testing](https://jestjs.io/docs/snapshot-testing) feature is used in order to validate key parts of the API response. Where this is not straightforward, for example when the response returns creation dates which vary over time, we've fallen back to more specific assertions.
