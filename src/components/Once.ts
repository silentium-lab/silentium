import { TapParent } from "base/Tap";
import { MessageType } from "types/MessageType";
import { TapType } from "types/TapType";

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

  public pipe(tap: TapType<T>): this {
    this.$base.pipe(this.parent.child(tap));
    return this;
  }

  private parent = TapParent<T>(function (v, child) {
    if (!child.isFilled) {
      child.isFilled = true;
      this.use(v);
    }
  }, this);
}
