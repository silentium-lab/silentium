import { describe, expect, test, vitest } from "vitest";
import { Late } from "./Late";
import { Once } from "./Once";
import { User } from "../base";

describe("Once.test", () => {
  test("with not called check", () => {
    const l = new Late<number>();
    const info = new Once(l);
    const g = vitest.fn();
    info.event(new User(g));

    expect(g).not.toHaveBeenCalled();
    l.use(111);
    expect(g).toBeCalledWith(111);
  });

  test("once main process", () => {
    const l = new Late<number>(123);
    const info = new Once(l);
    const g = vitest.fn();
    info.event(new User(g));

    l.use(321);

    expect(g).toBeCalledWith(123);
  });
});
