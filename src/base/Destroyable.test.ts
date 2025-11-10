import { Destroyable } from "base/Destroyable";
import { describe, expect, test, vi } from "vitest";

describe("Destroyable.test", () => {
  test("destroy calls destroy on base if available", () => {
    const destroyMock = vi.fn();
    const base = { destroy: destroyMock };
    const destroyable = Destroyable(base);

    destroyable.destroy();

    expect(destroyMock).toHaveBeenCalledTimes(1);
  });

  test("destroy does not call destroy on base if not available", () => {
    const base = { value: 42 };
    const destroyable = Destroyable(base);

    expect(() => destroyable.destroy()).not.toThrow();
  });
});
