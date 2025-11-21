import { describe, expect, test, vitest } from "vitest";
import { Late } from "components/Late";
import { Once } from "components/Once";

describe("Once.test", () => {
  test("with not called check", () => {
    const l = Late<number>();
    const info = Once(l);
    const g = vitest.fn();
    info.then(g);

    expect(g).not.toHaveBeenCalled();
    l.use(111);
    expect(g).toBeCalledWith(111);
  });

  test("once main process", () => {
    const l = Late<number>(123);
    const info = Once(l);
    const g = vitest.fn();
    info.then(g);

    l.use(321);

    expect(g).toBeCalledWith(123);
  });
});
