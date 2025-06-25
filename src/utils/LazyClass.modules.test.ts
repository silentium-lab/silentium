import { expect, test, vitest } from "vitest";
import { Information } from "../Information";
import { O, Owner } from "../Owner";
import { LazyType } from "../types/LazyType";
import { lazyClass } from "./LazyClass";

class TestClass {
  private info: Information;

  public constructor(
    baseNum: number,
    modules: { main: LazyType<Information> },
  ) {
    this.info = modules.main.get(baseNum + 55);
  }

  public value(owner: Owner) {
    this.info.value(owner);
    return this;
  }
}

class infoChangeable {
  public constructor(private v: number) {}

  public value(g: Owner<number>) {
    g.give(this.v);
    return this;
  }
}

test("LazyClass.modules.test", () => {
  const main = lazyClass(infoChangeable);
  const testinfo = lazyClass(TestClass, {
    main,
  });

  const info = testinfo.get(42);

  const owner = vitest.fn();
  info.value(O(owner));

  expect(owner).toBeCalled();
  expect(owner).toBeCalledWith(97);
});
