import { Message } from "base/Message";
import { Void } from "base/Void";
import { Catch } from "components/Catch";
import { describe, expect, test } from "vitest";

describe("Catch.test", () => {
  test("message with applied function", async () => {
    const $msg = Message(() => {
      throw new Error("Occured!");
    });
    const $exception = Catch<Error>($msg);

    $msg.then(Void());

    const error = await $exception;
    expect(error.message).toBe("Occured!");
  });
});
