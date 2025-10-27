import { ensureEvent } from "../helpers";
import { EventType, TransportType } from "../types";

/**
 * An event that emits values received from
 * any of its bound events
 */
export function Any<T>(...events: EventType<T>[]) {
  return new TheAny(...events);
}

class TheAny<T> implements EventType<T> {
  private $events: EventType[];

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
