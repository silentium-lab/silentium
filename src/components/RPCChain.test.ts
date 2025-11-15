import { Of } from "base/Of";
import { Transport } from "base/Transport";
import { RPC } from "components/RPC";
import { RPCChain } from "components/RPCChain";
import { RPCOf } from "components/RPCOf";
import { describe, expect, test, vi } from "vitest";

describe("RPCChain.test", () => {
  test("forwards RPC result to base message", () => {
    RPCOf("config").to(
      RPCChain(
        Of({
          name: "TestApp",
        }),
      ),
    );

    const g = vi.fn();
    RPC(
      Of({
        transport: "config",
        method: "get",
        result: Transport(g),
      }),
    ).result();

    expect(g).toHaveBeenCalledWith({
      name: "TestApp",
    });
  });
});
