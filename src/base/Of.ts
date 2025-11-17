import { MessageType } from "types/MessageType";
import { TapType } from "types/TapType";

/**
 * Helps convert a value into a message
 */
export function Of<T>(value: T) {
  return new OfImpl<T>(value);
}

export class OfImpl<T> implements MessageType<T> {
  public constructor(private value: T) {}

  public pipe(tap: TapType<T>): this {
    tap.use(this.value);
    return this;
  }
}
