import { Late } from "./Late";
import { expect, test, vitest } from "vitest";
import { Once } from "./Once";
import { From } from "../base";

test("Once._notcalled.test", () => {
  const l = new Late<number>();
  const info = new Once(l);
  const g = vitest.fn();
  info.value(new From(g));

  expect(g).not.toHaveBeenCalled();
  l.owner().give(111);
  expect(g).toBeCalledWith(111);
});
