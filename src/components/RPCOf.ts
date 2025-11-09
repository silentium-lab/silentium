import { Event } from "base/Event";
import { LateShared } from "components/LateShared";
import { RPC } from "components/RPC";
import { RPCType } from "types/RPCType";

/**
 * Event for the arrival of a specific RPC message
 * for specific transport
 */
export function RPCOf(transport: string) {
  const $transport = LateShared<RPCType>();
  RPC.transport[transport] = $transport;
  return Event<RPCType>((transport) => {
    $transport.event(transport);
  });
}
