import { O, Owner } from "../Owner";
import { expect, test, vitest } from "vitest";
import { lazyClass } from "./LazyClass";

class infoChangeable {
  public constructor(private v: number) {}

  public value(g: Owner<number>) {
    g.give(this.v);
    return this;
  }
}

test("LazyClass.test", () => {
  const infoPrivate = lazyClass(infoChangeable);
  const info = infoPrivate.get(42);

  const owner = vitest.fn();
  info.value(O(owner));

  expect(owner).toBeCalledWith(42);
});
