import { Message } from "base/Message";
import { Context } from "components/Context";
import { Late } from "components/Late";
import { ContextType } from "types/ContextType";

/**
 * Message for the arrival of a specific Context message
 * for specific transport
 *
 * @url https://silentium.pw/article/context/view
 */
export function ContextOf(transport: string) {
  const $msg = Late<ContextType>();
  Context.transport.set(transport, $msg.use.bind($msg));
  return Message<ContextType>((resolve, reject) => {
    $msg.catch(reject);
    $msg.then(resolve);
  });
}
