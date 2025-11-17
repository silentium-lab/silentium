import { MaybeMessage, MessageType } from "types/MessageType";
import { TapParent } from "base/Tap";
import { ConstructorType } from "types/ConstructorType";
import { TapType } from "types/TapType";
import { ActualMessage } from "base/ActualMessage";

/**
 * Filters values from the source message based on a predicate function,
 * optionally providing a default value when the predicate fails.
 */
export function Filtered<T>(
  $base: MaybeMessage<T>,
  predicate: ConstructorType<[T], boolean>,
  defaultValue?: T,
): MessageType<T> {
  return new FilteredImpl<T>(ActualMessage($base), predicate, defaultValue);
}

export class FilteredImpl<T> implements MessageType<T> {
  public constructor(
    private $base: MessageType<T>,
    private predicate: ConstructorType<[T], boolean>,
    private defaultValue?: T,
  ) {}

  public pipe(tap: TapType<T>) {
    this.$base.pipe(this.parent.child(tap));
    return this;
  }

  private parent = TapParent<T>(function (v, child: FilteredImpl<T>) {
    if (child.predicate(v)) {
      this.use(v);
    } else if (child.defaultValue !== undefined) {
      this.use(child.defaultValue);
    }
  }, this);
}
