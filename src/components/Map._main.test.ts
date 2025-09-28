import { DataType, DataUserType } from "../types";
import { expect, test } from "vitest";
import { of } from "../base";
import { diagram } from "../testing";
import { map } from "./Map";
import { applied } from "../components/Applied";

class X2 {
  public constructor(private baseNumber: DataType<number>) {}

  public value(owner: DataUserType<number>) {
    this.baseNumber((v) => {
      owner(v * 2);
    });
  }
}

test("Map._main.test", () => {
  const d = diagram();
  const infoMapped = map(of([1, 2, 3, 9]), (n: DataType<number>) => {
    const x2 = new X2(n);
    return x2.value.bind(x2);
  });

  applied(infoMapped, String)(d.user);

  expect(d.toString()).toBe("2,4,6,18");
});
