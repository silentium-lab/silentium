import { expect, test, vitest } from "vitest";
import { SourceChangeable } from "./SourceChangeable";
import { SourceAll } from "./SourceAll";

test("SourceAll._twoValuesBefore.test", () => {
  const one = new SourceChangeable(1);
  const two = new SourceChangeable(2);
  const all = new SourceAll<{ one: number; two: number }>();

  one.value(all.guestKey("one"));
  two.value(all.guestKey("two"));

  const g = vitest.fn();
  all.value((value) => {
    g(Object.values(value).join());
  });

  expect(g).toBeCalledWith("1,2");
});
