# dsh-dock-host

A generic **dock-button host** for the [dsh](https://github.com/deepseek-ai/deepseek-harness)
web client, built as a [Feature-Sliced Design](https://github.com/fsd-template/fsd-react)
static Cordis plugin. It renders one row of buttons above the composer/input
box and owns everything about _placement_: the `dockButtons` registry, theme
tokens, i18n (`dockHost` namespace, zh/en), overflow "更多" menu, and motion.

It is intentionally **feature-agnostic** — it knows nothing about what a
specific button does. A concrete feature (terminal, files, ...) registers its
own buttons into the registry; the host only places them.

## Layering (client-only)

`dsh-dock-host` is a **client-only** plugin: the host half (`src/index.ts`)
registers no tools and no RPC. The client half under `src/client/` follows the
framework's FSD layering:

```
src/
  index.ts                     host root: name only (no host capabilities)
  client/
    index.tsx                  client assembly root: provide registry, mount the
                               conversation.input.dock row slot, register i18n
    shared/
      config/context.ts        structural type contracts (slots, locale, logger)
      dock/registry.ts         the dockButtons registry (register/list/subscribe)
    features/
      dock-host/
        DockButtonsRow.tsx     the row + overflow menu (placement, tokens, i18n)
        DockButtonsRow.module.css  reduced-motion kill switch (build-time inline)
```

Host and client are physically isolated: host never uses JSX/React, client never
touches `window`/`document` directly. There are no cross-boundary code imports.
Because there is no host Remote RPC in this plugin, no Typert artifacts are
generated and no `harness.handle`/`host.call`/`styles.insert` builtins are used
(those are dynamic plugin evaluator builtins, not the static surface).

## The DockButton contract

A feature registers a button with the shape:

```ts
{
  id: string,                        // unique, namespaced e.g. 'terminal:open'
  order?: number,                    // ascending placement, default 0
  label: string | (() => string),    // thunk for i18n
  icon?: string,                     // optional glyph prefix
  enabled?: boolean | ((ctx) => boolean),  // optional visibility predicate
  primary?: boolean,                 // always visible before the overflow
  run(ctx: { input, inputActions, sessionId }): void | Promise<void>,
}
```

The host fills the row up to `DEFAULT_MAX_VISIBLE` (4) primary-then-ordered
buttons, and puts the rest in the overflow menu; primary buttons always stay
visible.

## Adding a feature (later)

A provider (terminal, files, ...) is added as another `client/features/<name>/`
slice. The client assembly root creates the registry once and hands it to each
feature so they can `registry.register(...)`. Because this is a single plugin,
no cross-plugin service composition is required.

## Commands

| Task          | Command                                                      |
| ------------- | ------------------------------------------------------------ |
| Install       | `npm install`                                                |
| Type-check    | `npm run type-check`                                         |
| Lint          | `npm run lint` / `npm run lint:no-emdash`                    |
| Format        | `npm run format:check` (fix with `npm run format`)           |
| Test          | `npm run test` / `npm run test:coverage`                     |
| Aliases drift | `npm run aliases:check`                                      |
| Build         | `npm run build` (host tsc + tsdown client bundle)            |
| Bundle verify | `npm run bundle:check`                                       |
| Full gate     | `npm run verify` (must stay green)                           |
| Smoke install | `node scripts/install-to-profile.mjs --profile web [--copy]` |

## Requirements

- Node >= 22.19.0, npm 10.9+
- A dsh web profile for smoke testing (optional for development)

## License

MIT (c) 2026 TecFancy

> This plugin is scaffolded from the [dsh-plugin-framework](../dsh-plugin-framework)
> template (feature-sliced design + host/client isolation + engineering gates).
