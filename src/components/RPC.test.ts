import { describe, expect, test, vi } from "vitest";
import { RPC } from "components/RPC";
import { Message } from "base/Message";
import { Tap } from "base/Tap";
import { RPCType } from "types/RPCType";

describe("RPC.test", () => {
  test("result() calls tap and returns result message", () => {
    const mockTap = {
      use: vi.fn(),
    };
    RPC.tap.default = mockTap as any;

    const $rpc = Message<RPCType>((tap) => {
      tap.use({
        method: "testMethod",
        params: { key: "value" },
      });
    });

    const rpcImpl = RPC($rpc);
    const $result = rpcImpl.result();

    expect(mockTap.use).toHaveBeenCalledWith({
      method: "testMethod",
      params: { key: "value" },
      result: expect.any(Object),
      error: expect.any(Object),
    });

    // Test that result message can be subscribed to
    const resultCallback = vi.fn();
    $result.pipe(Tap(resultCallback));

    // Since LateShared is used, it should not call immediately
    expect(resultCallback).not.toHaveBeenCalled();

    // Use the result
    ($result as any).use("testResult");
    expect(resultCallback).toHaveBeenCalledWith("testResult");
  });

  test("error() returns error message", () => {
    const mockTap = {
      use: vi.fn(),
    };
    RPC.tap.default = mockTap as any;

    const $rpc = Message<RPCType>((tap) => {
      tap.use({
        method: "testMethod",
      });
    });

    const rpcImpl = RPC($rpc);
    const $error = rpcImpl.error();

    // Test that error message can be subscribed to
    const errorCallback = vi.fn();
    $error.pipe(Tap(errorCallback));

    expect(errorCallback).not.toHaveBeenCalled();

    // Use the error
    ($error as any).use("testError");
    expect(errorCallback).toHaveBeenCalledWith("testError");
  });

  test("uses specified tap", () => {
    const defaultTap = {
      use: vi.fn(),
    };
    const customTap = {
      use: vi.fn(),
    };
    RPC.tap.default = defaultTap as any;
    RPC.tap.custom = customTap as any;

    const $msg = Message<RPCType>((tap) => {
      tap.use({
        method: "testMethod",
        tap: "custom",
      });
    });

    const $rpc = RPC($msg);
    $rpc.result();

    expect(customTap.use).toHaveBeenCalled();
    expect(defaultTap.use).not.toHaveBeenCalled();
  });

  test("uses specified tap", () => {
    const defaultTap = {
      use: vi.fn(),
    };
    const customTap = {
      use: vi.fn(),
    };
    RPC.tap.default = defaultTap as any;
    RPC.tap.custom = customTap as any;

    const $rpc = RPC({
      method: "testMethod",
      tap: "custom",
    });
    $rpc.result();

    expect(customTap.use).toHaveBeenCalled();
    expect(defaultTap.use).not.toHaveBeenCalled();
  });

  test("throws if tap not found", () => {
    // Reset taps
    RPC.tap = {} as any;

    const $msg = Message<RPCType>((tap) => {
      tap.use({
        method: "testMethod",
        tap: "nonexistent",
      });
    });

    const $rpc = RPC($msg);

    expect(() => $rpc.result()).toThrow("RPCImpl: Tap not found nonexistent");
  });
});
