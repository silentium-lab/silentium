import { Message } from "base/Message";
import { Context } from "components/Context";
import { Late } from "components/Late";
import { ContextType } from "types/ContextType";

/**
 * Message for the arrival of a specific RPC message
 * for specific transport
 */
export function ContextOf(transport: string) {
  const $msg = Late<ContextType>();
  Context.transport.set(transport, $msg.use.bind($msg));
  return Message<ContextType>((resolve, reject) => {
    $msg.catch(reject);
    $msg.then(resolve);
  });
}
