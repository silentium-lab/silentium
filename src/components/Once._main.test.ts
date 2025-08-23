import { Late } from "./Late";
import { expect, test, vitest } from "vitest";
import { Once } from "./Once";
import { From } from "src/base";

test("Once._main.test", () => {
  const l = new Late<number>(123);
  const info = new Once(l);
  const g = vitest.fn();
  info.value(new From(g));

  l.owner().give(321);

  expect(g).toBeCalledWith(123);
});
