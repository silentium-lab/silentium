import { describe, expect, test, vitest } from "vitest";
import { late } from "./Late";
import { once } from "./Once";

describe("Once.test", () => {
  test("with not called check", () => {
    const l = late<number>();
    const info = once(l.event);
    const g = vitest.fn();
    info(g);

    expect(g).not.toHaveBeenCalled();
    l.use(111);
    expect(g).toBeCalledWith(111);
  });

  test("once main process", () => {
    const l = late<number>(123);
    const info = once(l.event);
    const g = vitest.fn();
    info(g);

    l.use(321);

    expect(g).toBeCalledWith(123);
  });
});
