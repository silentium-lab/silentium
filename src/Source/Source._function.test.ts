import { SourceSync } from "./SourceSync";
import { give, GuestType } from "../Guest/Guest";
import { expect, test } from "vitest";

test("Source._function.test", () => {
  const sncsrc = new SourceSync((g: GuestType<number>) => {
    give(111, g);
  });
  expect(sncsrc.syncValue()).toBe(111);
});
