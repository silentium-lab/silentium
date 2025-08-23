import { expect, test } from "vitest";
import { Diagram } from "../testing";
import { Stream } from "./Stream";
import { Of } from "../base";

test("Stream.test", () => {
  const d = new Diagram();
  new Stream(new Of([1, 2, 3, 4, 5])).value(d.owner());

  expect(d.toString()).toBe("1|2|3|4|5");
});
