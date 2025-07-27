import { expect, test } from "vitest";
import { map } from "./Map";
import { InformationType, OwnerType } from "../types";
import { diagram } from "../testing";
import { i } from "./Information";
import { lazyClass } from "./LazyClass";

class X2 {
  public constructor(private baseNumber: InformationType<number>) {}

  public value(owner: OwnerType<number>) {
    this.baseNumber((v) => {
      owner(v * 2);
    });

    return this;
  }
}

test("Map.test", () => {
  const [d, dG] = diagram();
  const infoMapped = map(i([1, 2, 3, 9]), lazyClass(X2));

  infoMapped(dG);

  expect(d()).toBe("2,4,6,18");
});
