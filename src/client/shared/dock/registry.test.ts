import { describe, expect, it } from "vitest";
import type { DockButton } from "../config/index.ts";
import { createRegistry } from "./registry.ts";

function makeButton(id: string, overrides: Partial<DockButton> = {}): DockButton {
  return { id, label: id, run: () => undefined, ...overrides };
}

describe("createRegistry", () => {
  it("lists nothing before a button is registered", () => {
    expect(createRegistry().list()).toEqual([]);
  });

  it("registers a button and its disposer removes it", () => {
    const registry = createRegistry();
    const button = makeButton("a");
    const dispose = registry.register(button);
    expect(registry.list()).toEqual([button]);
    dispose();
    expect(registry.list()).toEqual([]);
  });

  it("re-registering an existing id replaces it, and that disposer removes it", () => {
    const registry = createRegistry();
    const first = makeButton("x");
    const second = makeButton("x");
    registry.register(first);
    const dispose = registry.register(second);
    expect(registry.list()).toEqual([second]);
    dispose();
    expect(registry.list()).toEqual([]);
  });

  it("notifies subscribers on register and dispose", () => {
    const registry = createRegistry();
    const seen: number[] = [];
    registry.subscribe(() => seen.push(registry.list().length));
    registry.register(makeButton("a"));
    registry.register(makeButton("b"));
    expect(seen).toEqual([1, 2]);
  });

  it("unsubscribes when the returned disposer runs", () => {
    const registry = createRegistry();
    const seen: number[] = [];
    const unsubscribe = registry.subscribe(() => seen.push(registry.list().length));
    registry.register(makeButton("a"));
    unsubscribe();
    registry.register(makeButton("b"));
    expect(seen).toEqual([1]);
  });

  it("throws on a malformed button", () => {
    const registry = createRegistry();
    expect(() => registry.register({ id: "", run: "no" } as unknown as DockButton)).toThrow();
  });
});
