import { Transport } from "base/Transport";
import { EventType } from "types/EventType";
import { RPCType } from "types/RPCType";

/**
 * Connects an external event to an RPC message chain
 */
export function RPCChain($base: EventType) {
  return Transport<RPCType>((rpc) => {
    if (!rpc.result) {
      throw new Error("RPCChain did not find result in rpc message");
    }
    $base.event(rpc.result);
  });
}
