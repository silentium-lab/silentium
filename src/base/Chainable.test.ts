import { describe, expect, test, vi } from "vitest";
import { Chainable } from "base/Chainable";
import { Late } from "components/Late";
import { Of } from "base/Of";

describe("Chainable.test", () => {
  test("chains message to source", () => {
    const late = Late<number>();
    const chainable = new Chainable(late);

    const message = Of(42);

    const resolver = vi.fn();
    late.then(resolver);

    chainable.chain(message);

    expect(resolver).toHaveBeenCalledWith(42);
  });
});
