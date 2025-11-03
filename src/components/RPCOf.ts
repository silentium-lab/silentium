import { Filtered } from "components/Filtered";
import { EventType } from "types/EventType";
import { RPCType } from "types/RPCType";

/**
 * Event for the arrival of a specific RPC message
 * for specific transport
 */
export function RPCOf($rpc: EventType<RPCType>, transport: string) {
  return Filtered($rpc, (rpc) => rpc.transport === transport);
}
