import { Of } from "base/Of";
import { Tap } from "base/Tap";
import { RPC } from "components/RPC";
import { RPCOf } from "components/RPCOf";
import { describe, expect, test, vi } from "vitest";

describe("RPCOf.test", () => {
  test("creates message for specific tap and forwards RPC call", () => {
    const callback = vi.fn();
    RPCOf("testTap").pipe(Tap(callback));

    RPC(
      Of({
        tap: "testTap",
        method: "get",
        result: Tap(() => {}),
      }),
    ).result();

    expect(callback).toHaveBeenCalledWith({
      tap: "testTap",
      method: "get",
      result: expect.any(Object),
      error: expect.any(Object),
    });
  });
});
