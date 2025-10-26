import { Applied } from "../components/Applied";
import { expect, test } from "vitest";
import { Of } from "../base";
import { Diagram } from "../testing";
import { Stream } from "./Stream";

test("Stream.test", () => {
  const d = Diagram();
  new Applied(new Stream(new Of([1, 2, 3, 4, 5])), String).event(d.user);

  expect(d.toString()).toBe("1|2|3|4|5");
});
