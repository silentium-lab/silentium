import { TransportParent } from "../base/Transport";
import { ensureEvent } from "../helpers";
import { ConstructorType, EventType, TransportType } from "../types";

/**
 * An event that applies a function
 * to the value of the base event
 */
export function Applied<const T, R>(
  $base: EventType<T>,
  applier: ConstructorType<[T], R>,
) {
  return new AppliedEvent<T, R>($base, applier);
}

class AppliedEvent<T, R> implements EventType<R> {
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

  private transport = TransportParent(function (
    v: T,
    child: AppliedEvent<T, R>,
  ) {
    this.use(child.applier(v));
  }, this);
}
