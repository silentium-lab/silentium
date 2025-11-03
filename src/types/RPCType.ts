import { TransportType } from "types/TransportType";

/**
 * Type for passing action requirements
 * to an external system
 */
export interface RPCType extends Record<string, any> {
  // Method name for current call
  method: string;
  // Transport type name
  transport?: string;
  // Method params
  params?: Record<string, any>;
  result?: TransportType;
  error?: TransportType;
}
