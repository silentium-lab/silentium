import { describe, expect, test, vi } from "vitest";
import { Catch } from "components/Catch";
import { Message } from "base/Message";
import { Transport } from "base/Transport";
import { Void } from "base/Void";

describe("Catch.test", () => {
  test("message with applied function", () => {
    const errorUserExecutor = vi.fn();
    const $exception = Catch(
      Message(() => {
        throw new Error("Occured!");
      }),
      Transport(errorUserExecutor),
    );

    $exception.to(Void());

    expect(errorUserExecutor).toHaveBeenLastCalledWith("Occured!");
  });
});
