# @0noxtackore/ag2

AG-UI client for [AG2](https://ag2.ai/) (formerly AutoGen) servers that expose the AG-UI protocol via `AGUIStream`.

## Installation

```bash
npm install @0noxtackore/ag2
pnpm add @0noxtackore/ag2
yarn add @0noxtackore/ag2
```

## Usage

```ts
import { Ag2Agent } from "@0noxtackore/ag2";

const agent = new Ag2Agent({
  url: "http://localhost:8018/agentic_chat",
});

const result = await agent.runAgent({
  messages: [{ role: "user", content: "Hello!" }],
});
```

## References

- [AG2 AG-UI documentation](https://docs.ag2.ai/latest/docs/user-guide/ag-ui/)
