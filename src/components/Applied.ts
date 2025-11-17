import { MaybeMessage, MessageType } from "types/MessageType";
import { TapParent } from "base/Tap";
import { ConstructorType } from "types/ConstructorType";
import { ensureMessage } from "helpers/ensures";
import { TapType } from "types/TapType";
import { ActualMessage } from "base/ActualMessage";

/**
 * An message that applies a function
 * to the value of the base message
 */
export function Applied<const T, R>(
  $base: MaybeMessage<T>,
  applier: ConstructorType<[T], R>,
) {
  return new AppliedImpl<T, R>(ActualMessage($base), applier);
}

export class AppliedImpl<T, R> implements MessageType<R> {
  public constructor(
    private $base: MessageType<T>,
    private applier: ConstructorType<[T], R>,
  ) {
    ensureMessage($base, "Applied: base");
  }

  public pipe(tap: TapType<R>) {
    this.$base.pipe(this.tap.child(tap));
    return this;
  }

  private tap = TapParent(function (v: T, child: AppliedImpl<T, R>) {
    this.use(child.applier(v));
  }, this);
}
