import { ActualMessage } from "base/ActualMessage";
import { TapParent } from "base/Tap";
import { MaybeMessage, MessageType } from "types/MessageType";
import { TapType } from "types/TapType";

/**
 * Component that receives a data array and yields values one by one
 */
export function Stream<T>($base: MaybeMessage<T[]>) {
  return new StreamImpl<T>(ActualMessage($base));
}

export class StreamImpl<T> implements MessageType<T> {
  public constructor(private $base: MessageType<T[]>) {}

  public pipe(tap: TapType<T>): this {
    this.$base.pipe(this.parent.child(tap));
    return this;
  }

  private parent = TapParent<T[]>(function (v) {
    v.forEach((cv) => {
      this.use(cv);
    });
  });
}
