import { Message } from "base/Message";
import { LateShared } from "components/LateShared";
import { RPC } from "components/RPC";
import { RPCType } from "types/RPCType";

/**
 * Message for the arrival of a specific RPC message
 * for specific transport
 */
export function RPCOf(transport: string) {
  const $transport = LateShared<RPCType>();
  RPC.transport[transport] = $transport;
  return Message<RPCType>((transport) => {
    $transport.to(transport);
  });
}
