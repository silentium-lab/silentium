import { expect, test } from "vitest";
import { patron } from "./Patron";
import { PatronPool } from "./PatronPool";

test("PatronPool.test", () => {
  const pool = new PatronPool<number>(null);
  let receivedCount = 0;

  pool.add(
    patron((value) => {
      receivedCount += value;
    }),
  );
  pool.add(
    patron((value) => {
      receivedCount += value;
    }),
  );
  pool.give(2);

  expect(receivedCount).toBe(4);
});
