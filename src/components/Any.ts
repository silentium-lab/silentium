import { ensureEvent } from "../helpers";
import { EventType, EventUserType } from "../types";

export function Any<T>(...events: EventType<T>[]) {
  return new TheAny(...events);
}

class TheAny<T> implements EventType<T> {
  private $events: EventType[];

  public constructor(...events: EventType<T>[]) {
    this.$events = events;
  }

  public event(user: EventUserType<T>): this {
    this.$events.forEach((event) => {
      ensureEvent(event, "Any: item");
      event.event(user);
    });
    return this;
  }
}
