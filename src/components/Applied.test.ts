import { describe, expect, test, vi } from "vitest";
import { Applied } from "./Applied";
import { Of } from "../base/Of";
import { Transport } from "../base/Transport";

describe("Applied.test", () => {
  test("event with applied function", () => {
    const info = Of(2);
    const infoDouble = Applied(info, (x) => x * 2);

    const g = vi.fn();
    infoDouble.event(Transport(g));

    expect(g).toBeCalledWith(4);
  });
});
