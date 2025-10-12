import { destroyContainer } from "../base/DestroyContainer";
import { _void } from "../base/Void";
import { describe, expect, test } from "vitest";

describe("DestroyContainer.test", () => {
  test("Destructor always exists", () => {
    const destroyed: number[] = [];

    const e = () => {
      return () => {
        destroyed.push(1);
      };
    };

    const c = destroyContainer();
    c.add(e)(_void);
    c.add(e)(_void);

    c.destroy();

    expect(destroyed).toStrictEqual([1, 1]);
  });
});
