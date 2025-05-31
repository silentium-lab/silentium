import { expect, test } from "vitest";
import { firstVisit } from "../Guest/Guest";

test("Guest.firstVisit.test", () => {
  let visitedTimes = 0;

  const visit = firstVisit(() => {
    visitedTimes += 1;
  });

  visit();
  visit();
  visit();

  expect(visitedTimes).toBe(1);
});
