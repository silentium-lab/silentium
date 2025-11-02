import { TransportParent } from "base/Transport";
import { EventType } from "types/EventType";
import { TransportType } from "types/TransportType";

/**
 * Limits the number of values from the information source
 * to a single value - once the first value is emitted, no more
 * values are delivered from the source
 */
export function Once<T>($base: EventType<T>) {
  return new OnceEvent<T>($base);
}

class OnceEvent<T> implements EventType<T> {
  private isFilled = false;

  public constructor(private $base: EventType<T>) {}

  public event(transport: TransportType<T>): this {
    this.$base.event(this.parent.child(transport));
    return this;
  }

  private parent = TransportParent<T>(function (v, child) {
    if (!child.isFilled) {
      child.isFilled = true;
      this.use(v);
    }
  }, this);
}
