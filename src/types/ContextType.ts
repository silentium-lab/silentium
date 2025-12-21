import { ConstructorType } from "types/ConstructorType";

/**
 * Type for passing action requirements
 * to an external system
 */
export interface ContextType extends Record<string, any> {
  transport: any;
  params?: Record<string, any>;
  result?: ConstructorType<[any]>;
  error?: ConstructorType<[any]>;
  value?: any;
}
