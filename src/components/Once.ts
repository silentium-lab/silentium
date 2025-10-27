import { ParentTransport } from "../base";
import { EventType, TransportType } from "../types";

/**
 * Limits the number of values from the information source
 * to a single value - once the first value is emitted, no more
 * values are delivered from the source
 */
export function Once<T>($base: EventType<T>) {
  return new TheOnce<T>($base);
}

class TheOnce<T> implements EventType<T> {
  private isFilled = false;

  public constructor(private $base: EventType<T>) {}

  public event(transport: TransportType<T>): this {
    this.$base.event(this.parent.child(transport));
    return this;
  }

  private parent = new ParentTransport<T>((v, child) => {
    if (!this.isFilled) {
      this.isFilled = true;
      child.use(v);
    }
  });
}
