import PrioritySet from "../utils/PrioritySet";
import { expect, test } from "vitest";

test("PrioritySet._reverse.test", () => {
  const priority = new PrioritySet();
  priority.add(1, 100);
  priority.add(2, 101);

  expect(Array.from(priority.values())).toStrictEqual([2, 1]);
});
