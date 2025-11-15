import { TransportParent } from "base/Transport";
import { MessageType } from "types/MessageType";
import { TransportType } from "types/TransportType";

/**
 * Limits the number of values from the information source
 * to a single value - once the first value is emitted, no more
 * values are delivered from the source
 */
export function Once<T>($base: MessageType<T>) {
  return new OnceImpl<T>($base);
}

export class OnceImpl<T> implements MessageType<T> {
  private isFilled = false;

  public constructor(private $base: MessageType<T>) {}

  public to(transport: TransportType<T>): this {
    this.$base.to(this.parent.child(transport));
    return this;
  }

  private parent = TransportParent<T>(function (v, child) {
    if (!child.isFilled) {
      child.isFilled = true;
      this.use(v);
    }
  }, this);
}
