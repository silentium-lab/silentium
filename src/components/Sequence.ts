import { TapParent } from "base/Tap";
import { MessageType } from "types/MessageType";
import { TapType } from "types/TapType";

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

  public pipe(tap: TapType<T[]>): this {
    this.$base.pipe(this.parent.child(tap));
    return this;
  }

  private parent = TapParent<T>(function (v, child) {
    child.result.push(v);
    this.use(child.result);
  }, this);
}
