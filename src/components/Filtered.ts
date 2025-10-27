import { ParentTransport } from "../base/Transport";
import { EventType, ConstructorType, TransportType } from "../types";

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

  private parent = new ParentTransport<T>((v, child) => {
    if (this.predicate(v)) {
      child.use(v);
    } else if (this.defaultValue !== undefined) {
      child.use(this.defaultValue);
    }
  });
}
