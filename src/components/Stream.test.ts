import { Applied } from "../components/Applied";
import { expect, test } from "vitest";
import { Stream } from "./Stream";
import { Diagram } from "../testing/Diagram";
import { Of } from "../base/Of";

test("Stream.test", () => {
  const d = Diagram();
  Applied(Stream(Of([1, 2, 3, 4, 5])), String).event(d.transport);

  expect(d.toString()).toBe("1|2|3|4|5");
});
