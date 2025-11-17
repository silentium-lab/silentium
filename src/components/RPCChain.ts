import { ActualMessage } from "base/ActualMessage";
import { Tap } from "base/Tap";
import { MaybeMessage } from "types/MessageType";
import { RPCType } from "types/RPCType";

/**
 * Connects an external message to an RPC message chain
 */
export function RPCChain($base: MaybeMessage) {
  return Tap<RPCType>((rpc) => {
    if (!rpc.result) {
      throw new Error("RPCChain did not find result in rpc message");
    }
    ActualMessage($base).pipe(rpc.result);
  });
}
