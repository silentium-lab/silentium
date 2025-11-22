import { Applied } from "components/Applied";
import { Stream } from "components/Stream";
import { Diagram } from "testing/Diagram";
import { expect, test } from "vitest";

test("Stream.test", () => {
  const d = Diagram();
  Applied(Stream([1, 2, 3, 4, 5]), String).then(d.resolver);

  expect(d.toString()).toBe("1|2|3|4|5");
});
