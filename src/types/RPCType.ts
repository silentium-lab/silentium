import { TapType } from "types/TapType";

/**
 * Type for passing action requirements
 * to an external system
 */
export interface RPCType extends Record<string, any> {
  // Method name for current call
  method: string;
  // Tap type name
  tap?: string;
  // Method params
  params?: Record<string, any>;
  result?: TapType;
  error?: TapType;
}
