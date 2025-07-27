import { expect, test, vi } from "vitest";
import { of } from "./Of";

test("Of.test", () => {
  const [ofs, ofg] = of<number>();

  const o = vi.fn();
  ofs(o);

  expect(o).not.toHaveBeenCalled();

  ofg(1);

  expect(o).toHaveBeenCalledWith(1);

  ofg(2);

  expect(o).toHaveBeenCalledWith(2);
});
