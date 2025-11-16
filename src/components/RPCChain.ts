import { ActualMessage } from "base/ActualMessage";
import { Transport } from "base/Transport";
import { MaybeMessage } from "types/MessageType";
import { RPCType } from "types/RPCType";

/**
 * Connects an external message to an RPC message chain
 */
export function RPCChain($base: MaybeMessage) {
  return Transport<RPCType>((rpc) => {
    if (!rpc.result) {
      throw new Error("RPCChain did not find result in rpc message");
    }
    ActualMessage($base).to(rpc.result);
  });
}
