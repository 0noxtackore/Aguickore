# @0noxtackore/langroid

TypeScript client integration for Langroid agents with AG-UI.

## Installation

```bash
npm install @0noxtackore/langroid
```

## Usage

```typescript
import { LangroidHttpAgent } from "@0noxtackore/langroid";

const agent = new LangroidHttpAgent({
  url: "http://localhost:8000/",
});

// Use the agent with AG-UI clients
```

## Features

- **HTTP Agent** – Connect to Langroid Python servers via HTTP
- **Event Streaming** – Full support for AG-UI event streaming
- **Type Safety** – Fully typed with TypeScript

## Requirements

- Langroid Python server running (see `../python/README.md`)
- AG-UI compatible client

