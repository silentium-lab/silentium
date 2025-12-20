import { describe, expect, test, vi } from "vitest";
import { Applied } from "components/Applied";
import { Of } from "base/Of";

describe("Applied.test", () => {
  test("message with applied function", () => {
    const info = Of(2);
    const doubled = Applied(info, (x) => x * 2);

    const g = vi.fn();
    doubled.then(g);

    expect(g).toBeCalledWith(4);
  });

  test("value with applied function", () => {
    const doubled = Applied(2, (x) => x * 2);

    const g = vi.fn();
    doubled.then(g);

    expect(g).toBeCalledWith(4);
  });

  test("value with applied function", () => {
    const doubled = Applied(2, String);

    const g = vi.fn();
    doubled.then(g);

    expect(g).toBeCalledWith("2");
  });

  test("value with undefined", () => {
    const doubled = Applied(2, () => undefined);

    const g = vi.fn();
    doubled.then(g);

    expect(g).not.toHaveBeenCalled();
  });

  test("applier returns a message", () => {
    const base = Of(2);
    const applied = Applied(base, (x) => Of(x * 3));

    const g = vi.fn();
    applied.then(g);

    expect(g).toBeCalledWith(6);
  });
});
