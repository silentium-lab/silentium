import { TransportParent } from "../base/Transport";
import { ConstructorType, EventType, TransportType } from "../types";

export function Filtered<T>(
  $base: EventType<T>,
  predicate: ConstructorType<[T], boolean>,
  defaultValue?: T,
) {
  return new TheFiltered<T>($base, predicate, defaultValue);
}

class TheFiltered<T> implements EventType<T> {
  public constructor(
    private $base: EventType<T>,
    private predicate: ConstructorType<[T], boolean>,
    private defaultValue?: T,
  ) {}

  public event(transport: TransportType<T>) {
    this.$base.event(this.parent.child(transport));
    return this;
  }

  private parent = TransportParent<T>(function (v, child: TheFiltered<T>) {
    if (child.predicate(v)) {
      this.use(v);
    } else if (child.defaultValue !== undefined) {
      this.use(child.defaultValue);
    }
  }, this);
}
