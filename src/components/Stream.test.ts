import { expect, test } from "vitest";
import { diagram } from "../testing";
import { stream } from "./Stream";
import { i } from "./Information";

test("Stream.test", () => {
  const [d, dG] = diagram();
  stream(i([1, 2, 3, 4, 5]))(dG);

  expect(d()).toBe("1|2|3|4|5");
});
