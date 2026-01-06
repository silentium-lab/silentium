import { ActualMessage } from "base/ActualMessage";
import { MaybeMessage } from "types/MessageType";
import { ContextType } from "types/ContextType";
import { isSource } from "helpers/guards";

/**
 * Connects an external message to an Context message chain
 *
 * @url https://silentium.pw/article/context/view
 */
export function ContextChain(base: MaybeMessage) {
  const $base = ActualMessage(base);
  return (context: ContextType) => {
    if (context.value && isSource(base)) {
      base.use(context.value);
      return;
    }
    if (!context.result) {
      throw new Error("ContextChain did not find result field in message");
    }
    $base.then(context.result);
  };
}
