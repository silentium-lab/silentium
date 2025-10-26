import { describe, expect, test, vi } from "vitest";
import { Of } from "../base/Of";
import { All } from "./All";
import { User } from "../base";

describe("All.test", () => {
  test("combined result from many events", () => {
    const a = new All(new Of(1), new Of(2));

    const o = vi.fn();
    a.event(new User(o));

    expect(o).toBeCalledWith([1, 2]);
  });
});
