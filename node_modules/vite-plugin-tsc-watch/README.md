# vite-plugin-tsc-watch [![npm](https://img.shields.io/npm/v/vite-plugin-tsc-watch)](https://www.npmjs.com/package/vite-plugin-tsc-watch)

Plugs tsc --watch into Vite dev server. Like [@nabla/vite-plugin-eslint](https://github.com/nabla/vite-plugin-eslint) this is a dev-only low noise plugin. It will just add logs to the dev server and not trigger an overlay while you're debugging or iterating on your code.

## Installation

```sh
npm i -D vite-plugin-tsc-watch
```

## Usage

```ts
import { defineConfig } from "vite";
import { tscPlugin } from "vite-plugin-tsc-watch";

export default defineConfig({
  plugins: [tscPlugin()],
});
```
