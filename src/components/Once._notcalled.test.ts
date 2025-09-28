import { expect, test, vitest } from "vitest";
import { late } from "./Late";
import { once } from "./Once";

test("Once._notcalled.test", () => {
  const l = late<number>();
  const info = once(l.value);
  const g = vitest.fn();
  info(g);

  expect(g).not.toHaveBeenCalled();
  l.give(111);
  expect(g).toBeCalledWith(111);
});
