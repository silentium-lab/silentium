import { describe, expect, test, vi } from "vitest";
import { Of } from "base/Of";
import { All } from "components/All";
import { Tap } from "base/Tap";

describe("All.test", () => {
  test("combined result from many messages", () => {
    const a = All(Of(1), Of(2));

    const o = vi.fn();
    a.pipe(Tap(o));

    expect(o).toBeCalledWith([1, 2]);
  });

  test("combined result from many raw values", () => {
    const a = All(1, 2, 3);

    const o = vi.fn();
    a.pipe(Tap(o));

    expect(o).toBeCalledWith([1, 2, 3]);
  });
});
