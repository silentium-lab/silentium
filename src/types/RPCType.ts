/**
 * Type for passing action requirements
 * to an external system
 */
export interface RPCType {
  method: string;
  params?: Record<string, any>;
}
