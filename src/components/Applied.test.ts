import { expect, test, vi } from "vitest";
import { Applied } from "./Applied";
import { From, Of } from "../base";

test("Applied.test", () => {
  const info = new Of(2);
  const infoDouble = new Applied(info, (x) => x * 2);

  const g = vi.fn();
  infoDouble.value(new From(g));

  expect(g).toBeCalledWith(4);
});
