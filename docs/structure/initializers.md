# Initializers

The initialization procedure is based on [the approach taken by the Locomotive framework](http://www.locomotivejs.org/guide/initialization/). App initialization steps have been split into separate functions in
the `initializers/` folder, and are run in a certain order. Any required app-wide references are set on the [`app.locals`](https://expressjs.com/en/4x/api.html#app.locals) object.