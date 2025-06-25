import { O } from "../Owner";
import { I } from "./Information";
import { expect, test, vi } from "vitest";
import { applied } from "./Applied";

test("Applied.test", () => {
  const info = I(2);
  const infoDouble = applied(info, (x) => x * 2);

  const g = vi.fn();
  infoDouble.value(O(g));

  expect(g).toBeCalledWith(4);
});
