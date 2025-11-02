import { LateShared } from "../components/LateShared";
import { TransportType } from "../types/TransportType";

/**
 * Type for passing action requirements
 * to an external system
 */
export interface RPCType {
  // Transport type name
  transport: string;
  // Method name for current call
  method: string;
  // Method params
  params?: Record<string, any>;
  result: TransportType;
  error: TransportType;
}

/**
 * Common bus for organizing communication with external
 * systems, useful for dependency inversion
 * from external systems
 */
export const $rpc = LateShared<RPCType>();
