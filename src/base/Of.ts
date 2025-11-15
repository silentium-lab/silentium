import { MessageType } from "types/MessageType";
import { TransportType } from "types/TransportType";

/**
 * Helps convert a value into a message
 */
export function Of<T>(value: T) {
  return new OfImpl<T>(value);
}

export class OfImpl<T> implements MessageType<T> {
  public constructor(private value: T) {}

  public to(transport: TransportType<T>): this {
    transport.use(this.value);
    return this;
  }
}
