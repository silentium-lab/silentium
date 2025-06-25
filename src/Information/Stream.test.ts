import { I } from "../Information/Information";
import { stream } from "../Information/Stream";
import { expect, test } from "vitest";
import { diagram } from "../../testing/diagram";

test("Stream.test", () => {
  const [d, dG] = diagram();
  stream(I([1, 2, 3, 4, 5])).value(dG);

  expect(d()).toBe("1|2|3|4|5");
});
