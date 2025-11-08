import { describe, expect, test, vi } from "vitest";
import { RPC } from "components/RPC";
import { Event } from "base/Event";
import { Transport } from "base/Transport";
import { RPCType } from "types/RPCType";

describe("RPC.test", () => {
  test("result() calls transport and returns result event", () => {
    const mockTransport = {
      use: vi.fn(),
    };
    RPC.transport.default = mockTransport as any;

    const rpcEvent = Event<RPCType>((transport) => {
      transport.use({
        method: "testMethod",
        params: { key: "value" },
      });
    });

    const rpcImpl = RPC(rpcEvent);
    const resultEvent = rpcImpl.result();

    expect(mockTransport.use).toHaveBeenCalledWith({
      method: "testMethod",
      params: { key: "value" },
      result: expect.any(Object),
      error: expect.any(Object),
    });

    // Test that result event can be subscribed to
    const resultCallback = vi.fn();
    resultEvent.event(Transport(resultCallback));

    // Since LateShared is used, it should not call immediately
    expect(resultCallback).not.toHaveBeenCalled();

    // Use the result
    (resultEvent as any).use("testResult");
    expect(resultCallback).toHaveBeenCalledWith("testResult");
  });

  test("error() returns error event", () => {
    const mockTransport = {
      use: vi.fn(),
    };
    RPC.transport.default = mockTransport as any;

    const rpcEvent = Event<RPCType>((transport) => {
      transport.use({
        method: "testMethod",
      });
    });

    const rpcImpl = RPC(rpcEvent);
    const errorEvent = rpcImpl.error();

    // Test that error event can be subscribed to
    const errorCallback = vi.fn();
    errorEvent.event(Transport(errorCallback));

    expect(errorCallback).not.toHaveBeenCalled();

    // Use the error
    (errorEvent as any).use("testError");
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

    const rpcEvent = Event<RPCType>((transport) => {
      transport.use({
        method: "testMethod",
        transport: "custom",
      });
    });

    const rpcImpl = RPC(rpcEvent);
    rpcImpl.result();

    expect(customTransport.use).toHaveBeenCalled();
    expect(defaultTransport.use).not.toHaveBeenCalled();
  });

  test("throws if transport not found", () => {
    // Reset transports
    RPC.transport = {} as any;

    const rpcEvent = Event<RPCType>((transport) => {
      transport.use({
        method: "testMethod",
        transport: "nonexistent",
      });
    });

    const rpcImpl = RPC(rpcEvent);

    expect(() => rpcImpl.result()).toThrow(
      "RPCImpl: Transport not found nonexistent",
    );
  });
});
