import { expect, test, vi } from "vitest";
import { applied } from "./Applied";
import { i } from "./Information";

test("Applied.test", () => {
  const info = i(2);
  const infoDouble = applied(info, (x) => x * 2);

  const g = vi.fn();
  infoDouble(g);

  expect(g).toBeCalledWith(4);
});
