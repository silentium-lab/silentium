import { give, GuestType } from "../Guest/Guest";
import { SourceObjectType } from "../Source/Source";
import { expect, test, vitest } from "vitest";
import { personalClass } from "./PersonalClass";

class SourceChangeable implements SourceObjectType<number> {
  public constructor(private v: number) {}

  public value(g: GuestType<number>) {
    give(this.v, g);
    return this;
  }
}

test("PersonalClass.test", () => {
  const sourcePrivate = personalClass(SourceChangeable);
  const source = sourcePrivate.get(42);

  const guest = vitest.fn();
  source.value(guest);

  expect(guest).toBeCalledWith(42);
});
