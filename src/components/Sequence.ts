import { TransportParent } from "base/Transport";
import { MessageType } from "types/MessageType";
import { TransportType } from "types/TransportType";

/**
 * Creates a sequence that accumulates all values from the source into an array,
 * emitting the growing array with each new value.
 */
export function Sequence<T>($base: MessageType<T>) {
  return new SequenceImpl<T>($base);
}

export class SequenceImpl<T> implements MessageType<T[]> {
  private result: T[] = [];

  public constructor(private $base: MessageType<T>) {}

  public to(transport: TransportType<T[]>): this {
    this.$base.to(this.parent.child(transport));
    return this;
  }

  private parent = TransportParent<T>(function (v, child) {
    child.result.push(v);
    this.use(child.result);
  }, this);
}
