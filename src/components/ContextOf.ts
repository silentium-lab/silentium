import { Message } from "base/Message";
import { LateShared } from "components/LateShared";
import { Context } from "components/Context";
import { ContextType } from "types/ContextType";

/**
 * Message for the arrival of a specific RPC message
 * for specific transport
 */
export function ContextOf(transport: string) {
  const $msg = LateShared<ContextType>();
  Context.transport.set(transport, $msg.use.bind($msg));
  return Message<ContextType>((resolve, reject) => {
    $msg.catch(reject);
    $msg.then(resolve);
  });
}
