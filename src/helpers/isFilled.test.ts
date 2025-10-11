import { isFilled } from "../helpers/isFilled";
import { describe, test } from "vitest";
import { expectTypeOf } from "expect-type";

describe("isFilled.test", () => {
  test("type check", () => {
    expectTypeOf(isFilled<string | null>).guards.toBeString();
  });
});
