import { applied } from "../components/Applied";
import { expect, test } from "vitest";
import { of } from "../base";
import { diagram } from "../testing";
import { stream } from "./Stream";

test("Stream.test", () => {
  const d = diagram();
  applied(stream(of([1, 2, 3, 4, 5])), String)(d.user);

  expect(d.toString()).toBe("1|2|3|4|5");
});
