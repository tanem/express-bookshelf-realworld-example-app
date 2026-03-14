# Agents

Guidelines for AI agents working on this codebase.

## Testing

- Always tear down containers and volumes before testing: `docker-compose -f docker-compose.yml -f docker-compose.test.yml down -v`
- Rebuild with `--no-cache` after dependency changes: `docker-compose build --no-cache node`
- Run `npm run docker:test` as the primary gate — all 52 tests must pass.
- Run `npm run lint` and `npm run check:format` after any code change.
- Verify the app boots with `npm run docker:start` and responds to `curl http://localhost:3000/api/tags`.

## Code changes

- Verify each change individually before moving on. Don't batch multiple unrelated changes then test once.
- If a fix in one area breaks another, re-run all verification steps from the top.
- Don't skip or disable tests to make them pass. Fix the root cause.
- Use `npm run format` to auto-fix formatting after edits.

## Documentation

- Update README.md when changing prerequisites, setup steps, or commands.
- Update `.env.example` when adding new environment variables.
- Use plain technical language. No marketing copy, no superlatives, no filler.

## Commits

- Use plain imperative sentences in sentence case: "Fix knex version for bookshelf", "Upgrade core dependencies".
- Don't use conventional-commit prefixes (`fix:`, `chore:`, etc.).

## Architecture

- This is a CommonJS codebase. Don't use `import`/`export` syntax.
- Bookshelf.js is in maintenance mode. Don't refactor to a different ORM.
- Express 5, Knex 3, Node 22. Check compatibility before adding dependencies.
- Prefer built-in Node APIs over third-party packages (e.g. `crypto.randomUUID()` over `uuid`, `node --watch` over `nodemon`).
