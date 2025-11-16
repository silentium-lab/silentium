import { describe, expect, test, vi } from "vitest";
import { RPC } from "components/RPC";
import { Message } from "base/Message";
import { Transport } from "base/Transport";
import { RPCType } from "types/RPCType";

describe("RPC.test", () => {
  test("result() calls transport and returns result message", () => {
    const mockTransport = {
      use: vi.fn(),
    };
    RPC.transport.default = mockTransport as any;

    const $rpc = Message<RPCType>((transport) => {
      transport.use({
        method: "testMethod",
        params: { key: "value" },
      });
    });

    const rpcImpl = RPC($rpc);
    const $result = rpcImpl.result();

    expect(mockTransport.use).toHaveBeenCalledWith({
      method: "testMethod",
      params: { key: "value" },
      result: expect.any(Object),
      error: expect.any(Object),
    });

    // Test that result message can be subscribed to
    const resultCallback = vi.fn();
    $result.to(Transport(resultCallback));

    // Since LateShared is used, it should not call immediately
    expect(resultCallback).not.toHaveBeenCalled();

    // Use the result
    ($result as any).use("testResult");
    expect(resultCallback).toHaveBeenCalledWith("testResult");
  });

  test("error() returns error message", () => {
    const mockTransport = {
      use: vi.fn(),
    };
    RPC.transport.default = mockTransport as any;

    const $rpc = Message<RPCType>((transport) => {
      transport.use({
        method: "testMethod",
      });
    });

    const rpcImpl = RPC($rpc);
    const $error = rpcImpl.error();

    // Test that error message can be subscribed to
    const errorCallback = vi.fn();
    $error.to(Transport(errorCallback));

    expect(errorCallback).not.toHaveBeenCalled();

    // Use the error
    ($error as any).use("testError");
    expect(errorCallback).toHaveBeenCalledWith("testError");
  });

  test("uses specified transport", () => {
    const defaultTransport = {
      use: vi.fn(),
    };
    const customTransport = {
      use: vi.fn(),
    };
    RPC.transport.default = defaultTransport as any;
    RPC.transport.custom = customTransport as any;

    const $msg = Message<RPCType>((transport) => {
      transport.use({
        method: "testMethod",
        transport: "custom",
      });
    });

    const $rpc = RPC($msg);
    $rpc.result();

    expect(customTransport.use).toHaveBeenCalled();
    expect(defaultTransport.use).not.toHaveBeenCalled();
  });

  test("uses specified transport", () => {
    const defaultTransport = {
      use: vi.fn(),
    };
    const customTransport = {
      use: vi.fn(),
    };
    RPC.transport.default = defaultTransport as any;
    RPC.transport.custom = customTransport as any;

    const $rpc = RPC({
      method: "testMethod",
      transport: "custom",
    });
    $rpc.result();

    expect(customTransport.use).toHaveBeenCalled();
    expect(defaultTransport.use).not.toHaveBeenCalled();
  });

  test("throws if transport not found", () => {
    // Reset transports
    RPC.transport = {} as any;

    const $msg = Message<RPCType>((transport) => {
      transport.use({
        method: "testMethod",
        transport: "nonexistent",
      });
    });

    const $rpc = RPC($msg);

    expect(() => $rpc.result()).toThrow(
      "RPCImpl: Transport not found nonexistent",
    );
  });
});
