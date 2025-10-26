import { Event } from "../base/Event";
import { DestroyContainer } from "../base/DestroyContainer";
import { Void } from "../base/Void";
import { describe, expect, test } from "vitest";

describe("DestroyContainer.test", () => {
  test("Destructor always exists", () => {
    const destroyed: number[] = [];

    const e = new Event(() => {
      return () => {
        destroyed.push(1);
      };
    });

    const c = new DestroyContainer();
    c.add(e);
    c.add(e);

    e.event(new Void());

    c.destroy();

    expect(destroyed).toStrictEqual([1, 1]);
  });
});
