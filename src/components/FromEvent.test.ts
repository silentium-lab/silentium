import { describe, expect, test, vi } from "vitest";
import { of } from "../base";
import { fromEvent } from "./FromEvent";

describe("FromEvent.test", () => {
  test("from event with destructor", () => {
    let unsubscribed = false;
    const emitter = {
      on(name: string, h: (v: string) => void) {
        h(name + "123");
      },
      off() {
        unsubscribed = true;
      },
    };
    const i = fromEvent(of(emitter), of("click"), of("on"), of("off"));

    const o = vi.fn();
    const destroy = i(o);

    expect(o).toBeCalledWith("click123");

    destroy();
    expect(unsubscribed).toBe(true);
  });
});
