import { TransportParent } from "base/Transport";
import { EventType } from "types/EventType";
import { TransportType } from "types/TransportType";

/**
 * Creates a sequence that accumulates all values from the source into an array,
 * emitting the growing array with each new value.
 */
export function Sequence<T>($base: EventType<T>) {
  return new SequenceEvent<T>($base);
}

export class SequenceEvent<T> implements EventType<T[]> {
  private result: T[] = [];

  public constructor(private $base: EventType<T>) {}

  public event(transport: TransportType<T[]>): this {
    this.$base.event(this.parent.child(transport));
    return this;
  }

  private parent = TransportParent<T>(function (v, child) {
    child.result.push(v);
    this.use(child.result);
  }, this);
}
