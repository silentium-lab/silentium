import { EventType, TransportType } from "../types";

/**
 * Helps convert a value into an event
 */
export function Of<T>(value: T) {
  return new TheOf<T>(value);
}

class TheOf<T> implements EventType<T> {
  public constructor(private value: T) {}

  public event(transport: TransportType<T>): this {
    transport.use(this.value);
    return this;
  }
}
