import { Of } from "base/Of";
import { Transport } from "base/Transport";
import { RPC } from "components/RPC";
import { RPCOf } from "components/RPCOf";
import { describe, expect, test, vi } from "vitest";

describe("RPCOf.test", () => {
  test("creates event for specific transport and forwards RPC call", () => {
    const callback = vi.fn();
    RPCOf("testTransport").event(Transport(callback));

    RPC(
      Of({
        transport: "testTransport",
        method: "get",
        result: Transport(() => {}),
      }),
    ).result();

    expect(callback).toHaveBeenCalledWith({
      transport: "testTransport",
      method: "get",
      result: expect.any(Object),
      error: expect.any(Object),
    });
  });
});
