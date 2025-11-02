import { EventType } from "types/EventType";
import { TransportParent } from "base/Transport";
import { ConstructorType } from "types/ConstructorType";
import { TransportType } from "types/TransportType";

/**
 * Filters values from the source event based on a predicate function,
 * optionally providing a default value when the predicate fails.
 */
export function Filtered<T>(
  $base: EventType<T>,
  predicate: ConstructorType<[T], boolean>,
  defaultValue?: T,
) {
  return new FilteredEvent<T>($base, predicate, defaultValue);
}

class FilteredEvent<T> implements EventType<T> {
  public constructor(
    private $base: EventType<T>,
    private predicate: ConstructorType<[T], boolean>,
    private defaultValue?: T,
  ) {}

  public event(transport: TransportType<T>) {
    this.$base.event(this.parent.child(transport));
    return this;
  }

  private parent = TransportParent<T>(function (v, child: FilteredEvent<T>) {
    if (child.predicate(v)) {
      this.use(v);
    } else if (child.defaultValue !== undefined) {
      this.use(child.defaultValue);
    }
  }, this);
}
