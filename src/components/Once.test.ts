import { describe, expect, test, vitest } from "vitest";
import { Late } from "./Late";
import { Once } from "./Once";

describe("Once.test", () => {
  test("with not called check", () => {
    const l = Late<number>();
    const info = Once(l.event);
    const g = vitest.fn();
    info(g);

    expect(g).not.toHaveBeenCalled();
    l.use(111);
    expect(g).toBeCalledWith(111);
  });

  test("once main process", () => {
    const l = Late<number>(123);
    const info = Once(l.event);
    const g = vitest.fn();
    info(g);

    l.use(321);

    expect(g).toBeCalledWith(123);
  });
});
