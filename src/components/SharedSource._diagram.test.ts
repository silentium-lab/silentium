import { applied } from "../components/Applied";
import { expect, test } from "vitest";
import { diagram } from "../testing";
import { late } from "./Late";
import { sharedSource } from "./SharedSource";

test("SharedSource._diagram.test", () => {
  const d = diagram();
  const s = sharedSource(late<number>(), true);

  applied(s.value, String)(d.user);

  s.give(1);

  expect(d.toString()).toBe("1");
});
