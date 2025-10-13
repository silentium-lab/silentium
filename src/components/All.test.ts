import { describe, expect, test, vi } from "vitest";
import { Of } from "../base/Of";
import { All } from "./All";

describe("All.test", () => {
  test("combined result from many events", () => {
    const a = All(Of(1), Of(2));

    const o = vi.fn();
    a(o);

    expect(o).toBeCalledWith([1, 2]);
  });
});
