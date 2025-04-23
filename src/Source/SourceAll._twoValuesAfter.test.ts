import { value } from "../Source/Source";
import { expect, test, vitest } from "vitest";
import { sourceAll } from "./SourceAll";
import { sourceChangeable } from "./SourceChangeable";

test("SourceAll._twoValuesAfter.test", () => {
  const one = sourceChangeable(1);
  const two = sourceChangeable(2);
  const all = sourceAll<{ one: number; two: number }>([one, two]);

  const g = vitest.fn();
  value(all, (value) => {
    g(Object.values(value).join());
  });

  expect(g).toBeCalledWith("1,2");
});
