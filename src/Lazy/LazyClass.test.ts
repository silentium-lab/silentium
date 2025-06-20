import { give } from "../Guest/Guest";
import { expect, test, vitest } from "vitest";
import { lazyClass } from "./LazyClass";
import { SourceObjectType } from "../types/SourceType";
import { GuestType } from "../types/GuestType";

class SourceChangeable implements SourceObjectType<number> {
  public constructor(private v: number) {}

  public value(g: GuestType<number>) {
    give(this.v, g);
    return this;
  }
}

test("LazyClass.test", () => {
  const sourcePrivate = lazyClass(SourceChangeable);
  const source = sourcePrivate.get(42);

  const guest = vitest.fn();
  source.value(guest);

  expect(guest).toBeCalledWith(42);
});
