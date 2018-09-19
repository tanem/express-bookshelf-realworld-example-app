# Group by Coupling

The general rule with modules in the `lib/` dir is "things that change together, stay together". This is largely a personal preference after having to maintain apps that instead group by function, but the approach is also summarised nicely in this [express code structure](https://github.com/focusaurus/express_code_structure) example.

Each module is usually an Express sub-app. Code that is shared across modules is either promoted (e.g. middleware), or is added to a specific app-wide registry (e.g. models).
