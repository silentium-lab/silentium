import { Transport } from "base/Transport";
import { MessageType } from "types/MessageType";
import { RPCType } from "types/RPCType";

/**
 * Connects an external message to an RPC message chain
 */
export function RPCChain($base: MessageType) {
  return Transport<RPCType>((rpc) => {
    if (!rpc.result) {
      throw new Error("RPCChain did not find result in rpc message");
    }
    $base.to(rpc.result);
  });
}
