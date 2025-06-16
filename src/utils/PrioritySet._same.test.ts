import PrioritySet from "./PrioritySet";
import { expect, test } from "vitest";

test("PrioritySet._same.test", () => {
  const priority = new PrioritySet();
  priority.add(1, 100);
  priority.add(2, 100);

  expect(Array.from(priority.values())).toStrictEqual([1, 2]);
});
