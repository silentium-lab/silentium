import { Of } from "base/Of";
import { Context } from "components/Context";
import { Trackable } from "components/Trackable";
import { describe, expect, test, vi } from "vitest";

describe("Trackable.test", () => {
  test("sends created action on trackable creation", () => {
    const transportSpy = vi.fn();
    Context.transport.set("trackable", transportSpy);

    const target = { value: 42 };
    const name = "testComponent";

    Trackable(name, target);

    expect(transportSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        transport: "trackable",
        params: { name, action: "created" },
      }),
    );

    Context.transport.delete("trackable");
  });

  test("sends destroyed action on destroy access", () => {
    const transportSpy = vi.fn();
    Context.transport.set("trackable", transportSpy);

    const target = { value: 42 };
    const name = "testComponent";

    const proxy = Trackable(name, target) as any;

    void proxy.destroy;

    expect(transportSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        transport: "trackable",
        params: { name, action: "destroyed" },
      }),
    );

    Context.transport.delete("trackable");
  });

  test("proxy forwards other properties normally", () => {
    const transportSpy = vi.fn();
    Context.transport.set("trackable", transportSpy);

    const target = { value: 42, method: () => "hello" };
    const name = "testComponent";

    const proxy = Trackable(name, target) as any;

    expect(proxy.value).toBe(42);
    expect(proxy.method()).toBe("hello");
    expect(proxy.nonExistent).toBeUndefined();

    Context.transport.delete("trackable");
  });

  test("sends value action on message resolution", async () => {
    const transportSpy = vi.fn();
    Context.transport.set("trackable", transportSpy);

    const value = 42;
    const $m = Of(value);
    const name = "testComponent";

    const proxy = Trackable(name, $m);

    // Resolve the message
    await proxy;

    expect(transportSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        transport: "trackable",
        params: { name, action: "value", value },
      }),
    );

    Context.transport.delete("trackable");
  });
});
