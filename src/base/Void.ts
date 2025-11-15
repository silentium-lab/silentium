import { TransportType } from "types/TransportType";

/**
 * Transport that does nothing with the passed value,
 * needed for silent message triggering
 */
export function Void() {
  return new VoidImpl();
}

export class VoidImpl implements TransportType {
  public use(): this {
    return this;
  }
}
