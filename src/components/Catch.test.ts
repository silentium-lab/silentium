import { Event, User, Void } from "../base";
import { describe, expect, test, vi } from "vitest";
import { Catch } from "../components/Catch";

describe("Catch.test", () => {
  test("event with applied function", () => {
    const errorUserExecutor = vi.fn();
    const exceptionEvent = new Catch(
      Event(() => {
        throw new Error("Occured!");
      }),
      User(errorUserExecutor),
    );

    exceptionEvent.event(Void());

    expect(errorUserExecutor).toHaveBeenLastCalledWith("Occured!");
  });
});
