import { DestroyContainer } from "../base/DestroyContainer";
import { Void } from "../base/Void";
import { describe, expect, test } from "vitest";

describe("DestroyContainer.test", () => {
  test("Destructor always exists", () => {
    const destroyed: number[] = [];

    const e = () => {
      return () => {
        destroyed.push(1);
      };
    };

    const c = DestroyContainer();
    c.add(e)(Void);
    c.add(e)(Void);

    c.destroy();

    expect(destroyed).toStrictEqual([1, 1]);
  });
});
