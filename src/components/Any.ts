import { ensureEvent } from "../helpers";
import { EventType, TransportType } from "../types";

/**
 * An event that emits values received from
 * any of its bound events
 */
export function Any<const T>(...events: EventType<T>[]) {
  return new AnyEvent<T>(...events);
}

class AnyEvent<T> implements EventType<T> {
  private $events: EventType<T>[];

  public constructor(...events: EventType<T>[]) {
    this.$events = events;
  }

  public event(transport: TransportType<T>): this {
    this.$events.forEach((event) => {
      ensureEvent(event, "Any: item");
      event.event(transport);
    });
    return this;
  }
}
