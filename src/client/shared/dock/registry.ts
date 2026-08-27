import type { DockButton, DockButtonsRegistry } from "../config/index.ts";

/**
 * The dockButtons registry: feature packages register / list / subscribe.
 *
 * Pure and environment-free so it is trivial to unit test in a Node context;
 * the plugin provides the instance as the client `dockButtons` service so a
 * feature can `inject: ['dockButtons']` and declare a hard dependency.
 */
export function createRegistry(): DockButtonsRegistry {
  const buttons = new Map<string, DockButton>();
  const listeners = new Set<() => void>();

  const notify = (): void => {
    for (const listener of listeners) listener();
  };

  return {
    register(button: DockButton): () => void {
      if (button == null || typeof button.id !== "string" || typeof button.run !== "function") {
        throw new Error(
          "dockButtons.register(button) needs { id: string, run: (ctx) => void | Promise<void>, ... }",
        );
      }
      buttons.set(button.id, button);
      notify();
      return () => {
        if (buttons.get(button.id) === button) {
          buttons.delete(button.id);
          notify();
        }
      };
    },
    list(): DockButton[] {
      return Array.from(buttons.values());
    },
    subscribe(fn: () => void): () => void {
      listeners.add(fn);
      return () => {
        listeners.delete(fn);
      };
    },
  };
}
