# @0noxtackore/agno

Implementation of the AG-UI protocol for Agno.

Connects Agno agents to frontend applications via the AG-UI protocol using HTTP communication.

## Installation

```bash
npm install @0noxtackore/agno
pnpm add @0noxtackore/agno
yarn add @0noxtackore/agno
```

## Usage

```ts
import { AgnoAgent } from "@0noxtackore/agno";

// Create an AG-UI compatible agent
const agent = new AgnoAgent({
  url: "https://your-agno-server.com/agent",
  headers: { Authorization: "Bearer your-token" },
});

// Run with streaming
const result = await agent.runAgent({
  messages: [{ role: "user", content: "Hello from Agno!" }],
});
```

## Features

- **HTTP connectivity** – Direct connection to Agno agent servers
- **Multi-agent support** – Works with Agno's multi-agent system architecture
- **Streaming responses** – Real-time communication with full AG-UI event support
