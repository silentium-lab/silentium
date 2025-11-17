import { Of } from "base/Of";
import { Tap } from "base/Tap";
import { RPC } from "components/RPC";
import { RPCChain } from "components/RPCChain";
import { RPCOf } from "components/RPCOf";
import { describe, expect, test, vi } from "vitest";

describe("RPCChain.test", () => {
  test("forwards RPC result to base message", () => {
    RPCOf("config").pipe(
      RPCChain(
        Of({
          name: "TestApp",
        }),
      ),
    );

    const g = vi.fn();
    RPC(
      Of({
        tap: "config",
        method: "get",
        result: Tap(g),
      }),
    ).result();

    expect(g).toHaveBeenCalledWith({
      name: "TestApp",
    });
  });

  test("forwards RPC result to base value", () => {
    RPCOf("config").pipe(
      RPCChain({
        name: "TestApp",
      }),
    );

    const g = vi.fn();
    RPC({
      tap: "config",
      method: "get",
      result: Tap(g),
    }).result();

    expect(g).toHaveBeenCalledWith({
      name: "TestApp",
    });
  });
});
