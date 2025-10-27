import { ParentTransport } from "../base";
import { EventType, TransportType } from "../types";

export function Sequence<T>($base: EventType<T>) {
  return new TheSequence<T>($base);
}

/**
 * A component that takes one value at a time and returns
 * an array of all previous values
 */
class TheSequence<T> implements EventType<T[]> {
  private result: T[] = [];

  public constructor(private $base: EventType<T>) {}

  public event(transport: TransportType<T[]>): this {
    this.$base.event(this.parent.child(transport));
    return this;
  }

  private parent = new ParentTransport<T>((v, child) => {
    this.result.push(v);
    child.use(this.result);
  });
}
