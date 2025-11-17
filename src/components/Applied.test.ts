import { describe, expect, test, vi } from "vitest";
import { Applied } from "components/Applied";
import { Of } from "base/Of";
import { Tap } from "base/Tap";

describe("Applied.test", () => {
  test("message with applied function", () => {
    const info = Of(2);
    const doubled = Applied(info, (x) => x * 2);

    const g = vi.fn();
    doubled.pipe(Tap(g));

    expect(g).toBeCalledWith(4);
  });

  test("value with applied function", () => {
    const doubled = Applied(2, (x) => x * 2);

    const g = vi.fn();
    doubled.pipe(Tap(g));

    expect(g).toBeCalledWith(4);
  });
});
