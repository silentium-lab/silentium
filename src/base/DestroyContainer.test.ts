import { Message } from "base/Message";
import { DestroyContainer } from "base/DestroyContainer";
import { Void } from "base/Void";
import { describe, expect, test, vi } from "vitest";

describe("DestroyContainer.test", () => {
  test("Destructor always exists", () => {
    const destroyed: number[] = [];

    const e = Message(() => {
      return () => {
        destroyed.push(1);
      };
    });

    const c = DestroyContainer();
    c.add(e);
    c.add(e);

    e.then(Void());

    c.destroy();

    expect(destroyed).toStrictEqual([1]);
  });

  test("Many destroys", () => {
    const dc = DestroyContainer();
    const destructor = vi.fn();

    dc.add(destructor);
    dc.destroy();

    expect(destructor).toBeCalledTimes(1);

    dc.add(destructor);
    dc.destroy();
    expect(destructor).toBeCalledTimes(2);
  });
});
