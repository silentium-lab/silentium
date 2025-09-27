import { expect, test, vi } from "vitest";
import { of } from "../base/Of";
import { all } from "./All";

test("All.test", () => {
  const a = all(of(1), of(2));

  const o = vi.fn();
  a(o);

  expect(o).toBeCalledWith([1, 2]);
});
