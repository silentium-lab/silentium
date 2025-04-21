import { PrivateClass } from "./PrivateClass";
import { give, GuestType } from "../Guest/Guest";
import { SourceChangeableType } from "../Source/SourceChangeable";
import { expect, test, vitest } from "vitest";
import { PrivateType } from "./Private";
import { SourceObjectType } from "src/Source/Source";

class TestClass {
  private source: SourceChangeableType;

  public constructor(
    baseNum: number,
    modules: { main: PrivateType<SourceChangeableType> },
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

test("PrivateClass.modules.test", () => {
  const main = new PrivateClass(SourceChangeable);
  const testSource = new PrivateClass(TestClass, {
    main,
  });

  const source = testSource.get(42);

  const guest = vitest.fn();
  source.value(guest);

  expect(guest).toBeCalled();
  expect(guest).toBeCalledWith(97);
});
