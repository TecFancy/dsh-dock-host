// @vitest-environment jsdom
import { cleanup, render } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import type { ReactNode } from "react";
import { apply } from "./index.tsx";
import type { DockClientContext } from "./shared/config/index.ts";
import { DOCK_ID, DOCK_SLOT, LOCALE_NS } from "./features/dock-host/index.ts";

/**
 * Smoke tests for the client assembly root: apply() must register the dockHost
 * i18n dictionaries as effects and mount the conversation.input.dock slot with
 * a row that reads the composer input / actions.
 */
function fakeContext() {
  const registrations: { options: unknown; view: (props: unknown) => unknown }[] = [];
  const localeCalls: unknown[][] = [];
  const effects: (() => unknown)[] = [];
  const logger = () => ({ info: vi.fn(), warn: vi.fn(), error: vi.fn() });
  const ctx: DockClientContext = {
    slots: {
      inject: (slotName: string, register: () => void) => {
        expect(slotName).toBe(DOCK_SLOT);
        register();
      },
      register: (options, view) => {
        registrations.push({ options, view });
        return undefined;
      },
    },
    locale: {
      register: (...args) => {
        localeCalls.push(args);
        return undefined;
      },
      bind: () => () => "",
      subscribe: () => () => undefined,
    },
    logger,
    effect: (fn) => {
      effects.push(fn);
      return fn();
    },
  };
  return { ctx, registrations, localeCalls, effects };
}

describe("apply (client root)", () => {
  afterEach(cleanup);

  it("registers dockHost dictionaries and mounts the dock slot", () => {
    const { ctx, registrations, localeCalls, effects } = fakeContext();

    apply(ctx);

    expect(localeCalls).toHaveLength(2);
    expect(localeCalls[0]?.[0]).toBe(LOCALE_NS);
    expect(localeCalls[1]?.[0]).toBe(LOCALE_NS);
    expect(effects).toHaveLength(2);
    expect(registrations).toHaveLength(1);
    const registration = registrations[0]!;
    expect(registration.options).toMatchObject({ name: DOCK_SLOT, id: DOCK_ID });
    expect(registration.view).toBeTypeOf("function");
  });

  it("renders a dock row for the registered slot view", () => {
    const { ctx, registrations } = fakeContext();
    apply(ctx);

    const registration = registrations[0]!;
    const { container } = render(
      registration.view({
        input: { draft: "hi" },
        inputActions: { setDraft: () => undefined },
      }) as ReactNode,
    );
    expect(container.firstChild).not.toBeNull();
  });
});
