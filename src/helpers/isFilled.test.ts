import { isFilled } from "../helpers/isFilled";
import { test } from "vitest";
import { expectTypeOf } from "expect-type";

test("isFilled.test", () => {
  expectTypeOf(isFilled<string | null>).guards.toBeString();
});
