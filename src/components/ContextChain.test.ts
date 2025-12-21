import { Of } from "base/Of";
import { Context } from "components/Context";
import { ContextChain } from "components/ContextChain";
import { ContextOf } from "components/ContextOf";
import { Late } from "components/Late";
import { describe, expect, test, vi } from "vitest";

describe("ContextChain.test", () => {
  test("forwards context result to base message", () => {
    ContextOf("config").then(
      ContextChain(
        Of({
          name: "TestApp",
        }),
      ),
    );

    const g = vi.fn();
    Context("config").then(g);

    expect(g).toHaveBeenCalledWith({
      name: "TestApp",
    });
  });

  test("forwards context result to base value", () => {
    ContextOf("config").then(
      ContextChain({
        name: "TestApp",
      }),
    );

    const g = vi.fn();
    Context("config").then(g);

    expect(g).toHaveBeenCalledWith({
      name: "TestApp",
    });
  });

  test("source chaining", async () => {
    const $late = Late();
    ContextOf("title").then(ContextChain($late));

    Context("title").chain(Of("New Title"));

    expect(await $late).toBe("New Title");

    Context("title").use("Title from use");

    expect(await $late).toBe("Title from use");
  });
});
