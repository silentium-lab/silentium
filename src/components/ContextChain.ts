import { ActualMessage } from "base/ActualMessage";
import { MaybeMessage } from "types/MessageType";
import { ContextType } from "types/ContextType";

/**
 * Connects an external message to an RPC message chain
 */
export function ContextChain($base: MaybeMessage) {
  return (context: ContextType) => {
    if (!context.result) {
      throw new Error("ContextChain did not find result in rpc message");
    }
    ActualMessage($base).then(context.result);
  };
}
