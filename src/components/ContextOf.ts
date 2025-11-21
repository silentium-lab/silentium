import { Message } from "base/Message";
import { LateShared } from "components/LateShared";
import { Context } from "components/Context";
import { ContextType } from "types/ContextType";

/**
 * Message for the arrival of a specific RPC message
 * for specific tap
 */
export function ContextOf(tap: string) {
  const $tap = LateShared<ContextType>();
  Context.transport[tap] = $tap.use.bind($tap);
  return Message<ContextType>((tap) => {
    $tap.then(tap);
  });
}
