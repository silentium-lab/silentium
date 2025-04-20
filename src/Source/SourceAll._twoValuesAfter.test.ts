import { value } from "../Source/Source";
import { expect, test, vitest } from "vitest";
import { sourceAll } from "./SourceAll";
import { SourceChangeable } from "./SourceChangeable";

test("SourceAll._twoValuesAfter.test", () => {
  const one = new SourceChangeable(1);
  const two = new SourceChangeable(2);
  const all = sourceAll<{ one: number; two: number }>([one, two]);

  const g = vitest.fn();
  value(all, (value) => {
    g(Object.values(value).join());
  });

  expect(g).toBeCalledWith("1,2");
});
