import { describe, test } from "vitest";
import { expectTypeOf } from "expect-type";
import { isFilled } from "../helpers/guards";

describe("isFilled.test", () => {
  test("type check", () => {
    expectTypeOf(isFilled<string | null>).guards.toBeString();
  });
});
