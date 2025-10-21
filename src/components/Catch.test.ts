import { Void } from "../base";
import { describe, expect, test, vi } from "vitest";
import { Catch } from "../components/Catch";

describe("Catch.test", () => {
  test("event with applied function", () => {
    const g = vi.fn();
    const exceptionEvent = Catch(() => {
      throw new Error("Occured!");
    }, g);

    exceptionEvent(Void);

    expect(g).toHaveBeenLastCalledWith("Occured!");
  });
});
