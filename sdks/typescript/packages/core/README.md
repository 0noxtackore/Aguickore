# @0noxtackore/core

TypeScript definitions & runtime schemas for the **Agent-User Interaction (AG-UI) Protocol**.

`@0noxtackore/core` delivers the strongly-typed building blocks that every other AG-UI package is built on: message & state models, run inputs and the full set of streaming event types.

## Installation

```bash
# types and constants only — no runtime dependencies
npm install @0noxtackore/core
pnpm add @0noxtackore/core
yarn add @0noxtackore/core

# to use the validators on @0noxtackore/core/schemas, add zod (3.25.18+ or 4.x)
npm install @0noxtackore/core zod
```

zod is an optional peer dependency: the main entry never loads it, so an
application that only needs the types installs nothing else.

## Features

- 🧩 **Typed data models** – `Message`, `Tool`, `Context`, `RunAgentInput`, `State` …
- 🔄 **Streaming events** – over 30 event kinds covering assistant messages, tool calls, state updates, reasoning, activity, and the run and subagent lifecycles.
- ✅ **Runtime validation** – schemas catch malformed payloads early.
- 🚀 **Framework-agnostic** – works in Node.js, browsers and any agent framework that can emit JSON.

## Quick example

```ts
import { EventType } from "@0noxtackore/core";
// Validators live on the /schemas subpath and need zod installed; the main
// entry is types and constants only, so type-only consumers need no zod.
import { EventSchemas } from "@0noxtackore/core/schemas";

// Validate an incoming event
EventSchemas.parse({
  type: EventType.TEXT_MESSAGE_CONTENT,
  messageId: "msg_123",
  delta: "Hello, world!",
});
```

## Documentation

- Concepts & architecture: [`docs/concepts`](https://docs.ag-ui.com/concepts/architecture)
- Full API reference: [`docs/sdk/js/core`](https://docs.ag-ui.com/sdk/js/core/overview)

## Contributing

Bug reports and pull requests are welcome! Please read our [contributing guide](https://docs.ag-ui.com/development/contributing) first.

## License

MIT © 2025 AG-UI Protocol Contributors
