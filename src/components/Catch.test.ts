import { Event, User, Void } from "../base";
import { describe, expect, test, vi } from "vitest";
import { Catch } from "../components/Catch";

describe("Catch.test", () => {
  test("event with applied function", () => {
    const errorUserExecutor = vi.fn();
    const exceptionEvent = new Catch(
      new Event(() => {
        throw new Error("Occured!");
      }),
      new User(errorUserExecutor),
    );

    exceptionEvent.event(new Void());

    expect(errorUserExecutor).toHaveBeenLastCalledWith("Occured!");
  });
});
