// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import type { DockButton, LocaleService } from "../../shared/config/index.ts";
import { createRegistry } from "../../shared/dock/index.ts";
import { DockButtonsRow, labelOf } from "./index.ts";

function makeButton(id: string, overrides: Partial<DockButton> = {}): DockButton {
  return { id, label: id, run: () => undefined, ...overrides };
}

function baseProps() {
  return {
    registry: createRegistry(),
    input: { draft: "" },
    inputActions: { setDraft: vi.fn() },
  };
}

describe("labelOf", () => {
  it("uses the label (string or thunk) or the id, with an optional icon prefix", () => {
    expect(labelOf(makeButton("a", { label: () => "Alpha" }))).toBe("Alpha");
    expect(labelOf(makeButton("b"))).toBe("b");
    expect(labelOf(makeButton("c", { icon: "⌘" }))).toBe("⌘ c");
  });
});

describe("DockButtonsRow", () => {
  afterEach(cleanup);

  it("renders a React icon element before the label, keeping text icons as prefixes", () => {
    const props = baseProps();
    props.registry.register(
      makeButton("term", { label: "Terminal", icon: <svg data-testid="term-icon" /> }),
    );
    props.registry.register(makeButton("legacy", { icon: "⌘" }));
    render(<DockButtonsRow {...props} />);
    const term = screen.getByText("Terminal");
    expect(term.closest("button")?.querySelector("svg")).not.toBeNull();
    expect(term.closest("button")?.textContent).toContain("Terminal");
    expect(screen.getByText("⌘ legacy")).not.toBeNull();
  });

  it("renders nothing without input/inputActions", () => {
    const { container } = render(<DockButtonsRow registry={createRegistry()} />);
    expect(container.firstChild).toBeNull();
  });

  it("renders visible buttons and calls run on click", () => {
    const run = vi.fn();
    const props = baseProps();
    props.registry.register(makeButton("a", { run }));
    render(<DockButtonsRow {...props} />);
    fireEvent.click(screen.getByText("a"));
    expect(run).toHaveBeenCalledTimes(1);
  });

  it("respects the enabled predicate (boolean or function)", () => {
    const props = baseProps();
    props.registry.register(makeButton("on", { enabled: true }));
    props.registry.register(makeButton("off", { enabled: false }));
    props.registry.register(makeButton("fn-off", { enabled: () => false }));
    render(<DockButtonsRow {...props} />);
    expect(screen.queryByText("on")).not.toBeNull();
    expect(screen.queryByText("off")).toBeNull();
    expect(screen.queryByText("fn-off")).toBeNull();
  });

  it("orders buttons by order and pushes the rest into the toggleable menu", () => {
    const props = baseProps();
    for (const [id, order] of [
      ["first", 1],
      ["second", 2],
      ["third", 3],
      ["fourth", 4],
      ["fifth", 5],
    ] as const) {
      props.registry.register(makeButton(id, { order }));
    }
    render(<DockButtonsRow {...props} />);
    const more = screen.getByRole("button", { name: "更多" });
    expect(more.getAttribute("aria-expanded")).toBe("false");
    fireEvent.click(more);
    expect(more.getAttribute("aria-expanded")).toBe("true");
    // the overflow item is mounted (menu stays mounted, visibility-driven)
    expect(screen.getByText("fifth")).not.toBeNull();
  });

  it("keeps primary buttons visible ahead of the rest", () => {
    const props = baseProps();
    props.registry.register(makeButton("norm", { order: 1 }));
    props.registry.register(makeButton("prio", { order: 2, primary: true }));
    render(<DockButtonsRow {...props} />);
    const row = screen.getByText("norm").closest("div")!;
    const buttons = Array.from(row.querySelectorAll("button"));
    expect(buttons[0]?.textContent).toBe("prio");
  });

  it("forwards a rejected run to onButtonError", async () => {
    const onButtonError = vi.fn();
    const props = { ...baseProps(), onButtonError };
    props.registry.register(makeButton("bad", { run: () => Promise.reject(new Error("boom")) }));
    render(<DockButtonsRow {...props} />);
    fireEvent.click(screen.getByText("bad"));
    await Promise.resolve();
    await Promise.resolve();
    expect(onButtonError).toHaveBeenCalledWith(expect.any(Error), "bad");
  });

  it("binds the overflow chrome copy through the locale service", () => {
    const bind = vi.fn(() => (_key: string) => "Collapse");
    const locale: LocaleService = {
      register: vi.fn(),
      bind,
      subscribe: vi.fn(() => () => undefined),
    };
    const props = { ...baseProps(), locale };
    props.registry.register(makeButton("a"));
    render(<DockButtonsRow {...props} />);
    expect(bind).toHaveBeenCalledWith("dockHost");
  });
});
