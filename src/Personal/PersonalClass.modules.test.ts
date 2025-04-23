import { SourceObjectType } from "../Source/Source";
import { expect, test, vitest } from "vitest";
import { give, GuestType } from "../Guest/Guest";
import { SourceChangeableType } from "../Source/SourceChangeable";
import { PersonalType } from "./Personal";
import { personalClass } from "./PersonalClass";

class TestClass {
  private source: SourceChangeableType;

  public constructor(
    baseNum: number,
    modules: { main: PersonalType<SourceChangeableType> },
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

test("PersonalClass.modules.test", () => {
  const main = personalClass(SourceChangeable);
  const testSource = personalClass(TestClass, {
    main,
  });

  const source = testSource.get(42);

  const guest = vitest.fn();
  source.value(guest);

  expect(guest).toBeCalled();
  expect(guest).toBeCalledWith(97);
});
