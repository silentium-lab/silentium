import { TransportType } from "../types";

/**
 * Transport that does nothing with the passed value,
 * needed for silent event triggering
 */
export function Void() {
  return new VoidImpl();
}

class VoidImpl implements TransportType {
  public use(): this {
    return this;
  }
}
