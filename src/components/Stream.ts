import { TransportParent } from "base/Transport";
import { EventType } from "types/EventType";
import { TransportType } from "types/TransportType";

/**
 * Component that receives a data array and yields values one by one
 */
export function Stream<T>($base: EventType<T[]>) {
  return new StreamEvent<T>($base);
}

class StreamEvent<T> implements EventType<T> {
  public constructor(private $base: EventType<T[]>) {}

  public event(transport: TransportType<T>): this {
    this.$base.event(this.parent.child(transport));
    return this;
  }

  private parent = TransportParent<T[]>(function (v) {
    v.forEach((cv) => {
      this.use(cv);
    });
  });
}
