import { ensureEvent } from "../helpers";
import { ParentTransport } from "../base/Transport";
import { ConstructorType, EventType, TransportType } from "../types";

/**
 * An event that applies a function
 * to the value of the base event
 */
export function Applied<T, R>(
  $base: EventType<T>,
  applier: ConstructorType<[T], R>,
) {
  return new TheApplied<T, R>($base, applier);
}

class TheApplied<T, R> implements EventType<R> {
  public constructor(
    private $base: EventType<T>,
    private applier: ConstructorType<[T], R>,
  ) {
    ensureEvent($base, "Applied: base");
  }

  public event(transport: TransportType<R>) {
    this.$base.event(this.transport.child(transport));
    return this;
  }

  private transport = new ParentTransport((v: T, child) => {
    child.use(this.applier(v));
  });
}
