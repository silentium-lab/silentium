import { TapType } from "types/TapType";

/**
 * Tap that does nothing with the passed value,
 * needed for silent message triggering
 */
export function Void() {
  return new VoidImpl();
}

export class VoidImpl implements TapType {
  public use(): this {
    return this;
  }
}
