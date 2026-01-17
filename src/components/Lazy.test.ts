import { describe, expect, test, vi } from "vitest";
import { Lazy } from "components/Lazy";
import { Message } from "base/Message";
import { Of } from "base/Of";

describe("Lazy.test", () => {
  test("constructor is not called until then is called", () => {
    const constructor = vi.fn(() => Of(42));
    const lazy = Lazy(constructor);

    expect(constructor).not.toHaveBeenCalled();

    const resolve = vi.fn();
    lazy.then(resolve);

    expect(constructor).toHaveBeenCalled();
    expect(resolve).toHaveBeenCalledWith(42);
  });

  test("lazy message resolves with the inner message value", () => {
    const lazy = Lazy(() => Of("test"));
    const resolve = vi.fn();

    lazy.then(resolve);

    expect(resolve).toHaveBeenCalledWith("test");
  });

  test("lazy message rejects when inner message rejects", () => {
    const constructor = vi.fn(() => {
      return {
        then: vi.fn(),
        catch: vi.fn((reject) => reject("error")),
      };
    });
    const lazy = Lazy(constructor);
    const reject = vi.fn();

    lazy.catch(reject);
    lazy.then(vi.fn()); // trigger the executor

    expect(reject).toHaveBeenCalledWith("error");
  });

  test("destroy calls destroy on destroyable instance", () => {
    const destroy = vi.fn();
    const constructor = vi.fn(() => {
      return Message((resolve) => {
        resolve(123);
        return () => destroy();
      });
    });
    const lazy = Lazy(constructor);

    lazy.then(vi.fn());
    lazy.destroy();

    expect(destroy).toHaveBeenCalled();
  });

  test("destroy does not call destroy on non-destroyable instance", () => {
    const constructor = vi.fn(() => ({
      then: vi.fn((resolve) => resolve(456)),
      catch: vi.fn(),
    }));
    const lazy = Lazy(constructor);
    const destroy = vi.fn();

    // Mock the inner instance to have destroy but make isDestroyable return false
    const instance = constructor();
    Object.defineProperty(instance, "destroy", { value: destroy });

    lazy.then(vi.fn());
    lazy.destroy();

    expect(destroy).not.toHaveBeenCalled();
  });
});
