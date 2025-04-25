import { value } from "../Source/Source";
import { expect, test, vitest } from "vitest";
import { sourceAll } from "./SourceAll";
import { sourceOf } from "./SourceChangeable";

test("SourceAll._twoValuesBefore.test", () => {
  const one = sourceOf(1);
  const two = sourceOf(2);
  const all = sourceAll([one.value, two.value]);

  const g = vitest.fn();
  value(all, (value) => {
    g(Object.values(value).join());
  });

  expect(g).toBeCalledWith("1,2");
});
