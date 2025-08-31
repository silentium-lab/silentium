import { Diagram } from "../testing";
import { expect, test } from "vitest";
import { Late } from "./Late";
import { SharedSource } from "./SharedSource";

test("SharedSource._diagram.test", () => {
  const d = new Diagram();
  const s = new SharedSource(new Late<number>(), true);

  s.value(d.owner());

  s.give(1);

  expect(d.toString()).toBe("1");
});
