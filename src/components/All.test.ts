import { describe, expect, test, vi } from "vitest";
import { of } from "../base/Of";
import { all } from "./All";

describe("All.test", () => {
  test("combined result from many events", () => {
    const a = all(of(1), of(2));

    const o = vi.fn();
    a(o);

    expect(o).toBeCalledWith([1, 2]);
  });
});
