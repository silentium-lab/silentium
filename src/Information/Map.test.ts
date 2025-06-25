import { expect, test } from "vitest";
import { diagram } from "../../testing/diagram";
import { O, Owner } from "../Owner/Owner";
import { lazyClass } from "../utils/LazyClass";
import { I, Information } from "./Information";
import { map } from "./Map";

class X2 {
  public constructor(private baseNumber: Information<number>) {}

  public value(owner: Owner<number>) {
    this.baseNumber.value(
      O((v) => {
        owner.give(v * 2);
      }),
    );

    return this;
  }
}

test("Map.test", () => {
  const [d, dG] = diagram();
  const infoMapped = map(I([1, 2, 3, 9]), lazyClass(X2));

  infoMapped.value(dG);

  expect(d()).toBe("2,4,6,18");
});
