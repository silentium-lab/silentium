import { MaybeMessage, MessageType } from "types/MessageType";
import { TapParent } from "base/Tap";
import { ensureMessage } from "helpers/ensures";
import { TapType } from "types/TapType";
import { DestroyableType } from "types/DestroyableType";
import { ActualMessage } from "base/ActualMessage";

/**
 * Create local copy of source what can be destroyed
 */
export function Local<T>($base: MaybeMessage<T>) {
  return new LocalImpl<T>(ActualMessage($base));
}

export class LocalImpl<T> implements MessageType<T>, DestroyableType {
  private destroyed = false;

  public constructor(private $base: MessageType<T>) {
    ensureMessage($base, "Local: $base");
  }

  public pipe(tap: TapType<T>): this {
    this.$base.pipe(this.tap.child(tap));
    return this;
  }

  private tap = TapParent(function (v: T, child: LocalImpl<T>) {
    if (!child.destroyed) {
      this.use(v);
    }
  }, this);

  public destroy(): this {
    this.destroyed = true;
    return this;
  }
}
