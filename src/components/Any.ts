import { ensureEvent } from "../helpers";
import { EventType, EventUserType } from "../types";

export class Any<T> implements EventType<T> {
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
