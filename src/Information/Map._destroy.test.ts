import { O, Owner } from "../Owner";
import { expect, test } from "vitest";
import { lazyClass } from "../utils/LazyClass";
import { I, Information } from "./Information";
import { map } from "./Map";
import { ownerSync } from "../Owner/OwnerSync";

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

test("Map._destroy.test", () => {
  const i = I([I(1), I(2), I(3), I(9)]);
  const infoMapped = map(i, lazyClass(X2));
  const r = ownerSync(infoMapped);

  expect(r.syncValue().join()).toBe("2,4,6,18");
});
