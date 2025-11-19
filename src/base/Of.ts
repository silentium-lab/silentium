import { ConstructorType } from "types/ConstructorType";
import { MessageType } from "types/MessageType";

/**
 * Helps convert a value into a message
 */
export function Of<T>(value: T) {
  return new OfImpl<T>(value);
}

export class OfImpl<T> implements MessageType<T> {
  public constructor(private value: T) {}

  public then(tap: ConstructorType<[T]>): this {
    tap(this.value);
    return this;
  }
}
