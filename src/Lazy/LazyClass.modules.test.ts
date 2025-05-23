import { SourceObjectType } from "../Source/Source";
import { expect, test, vitest } from "vitest";
import { give, GuestType } from "../Guest/Guest";
import { SourceChangeableType } from "../Source/SourceChangeable";
import { LazyType } from "./Lazy";
import { lazyClass } from "./LazyClass";

class TestClass {
  private source: SourceChangeableType;

  public constructor(
    baseNum: number,
    modules: { main: LazyType<SourceChangeableType> },
  ) {
    this.source = modules.main.get(baseNum + 55);
  }

  public value(guest: GuestType) {
    this.source.value(guest);
    return this;
  }
}

class SourceChangeable implements SourceObjectType<number> {
  public constructor(private v: number) {}

  public value(g: GuestType<number>) {
    give(this.v, g);
    return this;
  }
}

test("LazyClass.modules.test", () => {
  const main = lazyClass(SourceChangeable);
  const testSource = lazyClass(TestClass, {
    main,
  });

  const source = testSource.get(42);

  const guest = vitest.fn();
  source.value(guest);

  expect(guest).toBeCalled();
  expect(guest).toBeCalledWith(97);
});
