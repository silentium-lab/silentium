import { expect, test, vi } from "vitest";
import { Late } from "./Late";
import { From } from "../base";

test("Late.test", () => {
  const l = new Late<number>();

  const o = vi.fn();
  l.value(new From(o));

  expect(o).not.toHaveBeenCalled();

  l.owner().give(1);

  expect(o).toHaveBeenCalledWith(1);

  l.owner().give(2);

  expect(o).toHaveBeenCalledWith(2);
});
