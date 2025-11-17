import { Message } from "base/Message";
import { LateShared } from "components/LateShared";
import { RPC } from "components/RPC";
import { RPCType } from "types/RPCType";

/**
 * Message for the arrival of a specific RPC message
 * for specific tap
 */
export function RPCOf(tap: string) {
  const $tap = LateShared<RPCType>();
  RPC.tap[tap] = $tap;
  return Message<RPCType>((tap) => {
    $tap.pipe(tap);
  });
}
