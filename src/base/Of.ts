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

  public then(r: ConstructorType<[T]>): this {
    r(this.value);
    return this;
  }
}
