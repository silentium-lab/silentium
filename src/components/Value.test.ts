import { describe, expect, test, vi } from "vitest";
import { Value } from "components/Value";
import { Of } from "base/Of";
import { Late } from "components/Late";

describe("Value.test", () => {
  test("access value property on message", () => {
    const msg = Of(42);
    const val = Value(msg);

    expect(val.value).toBe(42);
  });

  test("value property reflects changes in late message", () => {
    const late = Late(1);
    const val = Value(late);

    expect(val.value).toBe(1);

    late.use(2);
    expect(val.value).toBe(2);
  });

  test("other properties are still accessible", () => {
    const msg = Of("test");
    const val = Value(msg);

    const g = vi.fn();
    val.then(g);
    expect(g).toBeCalledWith("test");

    expect(val.value).toBe("test");
  });
});
