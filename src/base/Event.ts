import { ensureFunction } from "../helpers";
import { DestroyableType, EventType, TransportType } from "../types";

type EventExecutor<T> = (transport: TransportType<T>) => void | (() => void);

/**
 * An event created from an executor function.
 * The executor function can return an event destruction function.
 */
export function Event<T>(eventExecutor: EventExecutor<T>) {
  return new EventImpl<T>(eventExecutor);
}

class EventImpl<T> implements EventType<T>, DestroyableType {
  private mbDestructor: unknown;

  public constructor(private eventExecutor: EventExecutor<T>) {
    ensureFunction(eventExecutor, "Event: eventExecutor");
  }

  public event(transport: TransportType<T>) {
    this.mbDestructor = this.eventExecutor(transport);
    return this;
  }

  public destroy() {
    if (typeof this.mbDestructor === "function") {
      this.mbDestructor?.();
    }
    return this;
  }
}
