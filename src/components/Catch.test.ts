import { describe, expect, test, vi } from "vitest";
import { Catch } from "components/Catch";
import { Event } from "base/Event";
import { Transport } from "base/Transport";
import { Void } from "base/Void";

describe("Catch.test", () => {
  test("event with applied function", () => {
    const errorUserExecutor = vi.fn();
    const exceptionEvent = Catch(
      Event(() => {
        throw new Error("Occured!");
      }),
      Transport(errorUserExecutor),
    );

    exceptionEvent.event(Void());

    expect(errorUserExecutor).toHaveBeenLastCalledWith("Occured!");
  });
});
