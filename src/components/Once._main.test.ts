import { expect, test, vitest } from "vitest";
import { late } from "./Late";
import { once } from "./Once";

test("Once._main.test", () => {
  const l = late<number>(123);
  const info = once(l.value);
  const g = vitest.fn();
  info(g);

  l.give(321);

  expect(g).toBeCalledWith(123);
});
