import { describe, expect, test, vi } from "vitest";
import { Catch } from "components/Catch";
import { Message } from "base/Message";
import { Tap } from "base/Tap";
import { Void } from "base/Void";

describe("Catch.test", () => {
  test("message with applied function", () => {
    const errorUserExecutor = vi.fn();
    const $exception = Catch(
      Message(() => {
        throw new Error("Occured!");
      }),
      Tap(errorUserExecutor),
    );

    $exception.pipe(Void());

    expect(errorUserExecutor).toHaveBeenLastCalledWith("Occured!");
  });
});
