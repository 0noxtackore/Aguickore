# @0noxtackore/encoder

Event encoding utilities for the **Agent-User Interaction (AG-UI) Protocol**.

`@0noxtackore/encoder` handles content negotiation and format encoding for AG-UI events. It automatically chooses between Server-Sent Events (JSON) and Protocol Buffers based on client `Accept` headers, ensuring optimal transport efficiency.

## Installation

```bash
npm install @0noxtackore/encoder zod
pnpm add @0noxtackore/encoder zod
yarn add @0noxtackore/encoder zod
```

zod (3.25.18+ or 4.x) is a peer dependency. Protobuf encoding validates each
event with the schemas on `@0noxtackore/core/schemas`, using the zod your application
installs rather than a bundled copy.

## Features

- 🎯 **Content negotiation** – Automatic format selection based on `Accept` headers
- 📦 **Dual encoding** – SSE (JSON) and Protocol Buffer support
- ⚡ **Efficient binary** – Length-prefixed protobuf encoding for high-throughput scenarios
- 🔄 **Seamless fallback** – Graceful degradation to SSE when protobuf isn't supported

## Quick example

```ts
import { EventEncoder } from "@0noxtackore/encoder";
import { EventType } from "@0noxtackore/core";

const encoder = new EventEncoder({
  accept: "application/vnd.ag-ui.event+proto, text/event-stream",
});

const event = {
  type: EventType.TEXT_MESSAGE_CONTENT,
  messageId: "msg_123",
  delta: "Hello, world!",
};

// Returns protobuf-encoded binary data
const encoded = encoder.encodeBinary(event);
```

## Documentation

- Concepts & architecture: [`docs/concepts`](https://docs.ag-ui.com/concepts/architecture)
- Full API reference: [`docs/sdk/js/encoder`](https://docs.ag-ui.com/sdk/js/encoder)

## Contributing

Bug reports and pull requests are welcome! Please read our [contributing guide](https://docs.ag-ui.com/development/contributing) first.

## License

MIT © 2025 AG-UI Protocol Contributors
