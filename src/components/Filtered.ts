import { MessageType } from "types/MessageType";
import { TransportParent } from "base/Transport";
import { ConstructorType } from "types/ConstructorType";
import { TransportType } from "types/TransportType";

/**
 * Filters values from the source message based on a predicate function,
 * optionally providing a default value when the predicate fails.
 */
export function Filtered<T>(
  $base: MessageType<T>,
  predicate: ConstructorType<[T], boolean>,
  defaultValue?: T,
): MessageType<T> {
  return new FilteredImpl<T>($base, predicate, defaultValue);
}

export class FilteredImpl<T> implements MessageType<T> {
  public constructor(
    private $base: MessageType<T>,
    private predicate: ConstructorType<[T], boolean>,
    private defaultValue?: T,
  ) {}

  public to(transport: TransportType<T>) {
    this.$base.to(this.parent.child(transport));
    return this;
  }

  private parent = TransportParent<T>(function (v, child: FilteredImpl<T>) {
    if (child.predicate(v)) {
      this.use(v);
    } else if (child.defaultValue !== undefined) {
      this.use(child.defaultValue);
    }
  }, this);
}
