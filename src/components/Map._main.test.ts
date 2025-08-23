import { expect, test } from "vitest";
import { From, Of, TheInformation, TheOwner } from "../base";
import { Diagram } from "../testing";
import { LazyClass } from "./LazyClass";
import { Map } from "./Map";

class X2 {
  public constructor(private baseNumber: TheInformation<number>) {}

  public value(owner: TheOwner<number>) {
    this.baseNumber.value(
      new From((v) => {
        owner.give(v * 2);
      }),
    );

    return this;
  }
}

test("Map._main.test", () => {
  const d = new Diagram();
  const infoMapped = new Map(new Of([1, 2, 3, 9]), new LazyClass(X2));

  infoMapped.value(d.owner());

  expect(d.toString()).toBe("2,4,6,18");
});
