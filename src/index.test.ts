import { describe, expect, it } from "vitest";
import type { Context } from "@deepseek-ai/cordis";
import { apply } from "./index.js";

/**
 * The host root of dsh-dock-host is intentionally empty: all dock capabilities
 * live in the client half. This asserts apply() is a safe no-op.
 */
describe("apply (host root)", () => {
  it("is a no-op: dock-host registers no host capabilities", () => {
    expect(() => apply({} as unknown as Context)).not.toThrow();
  });
});
