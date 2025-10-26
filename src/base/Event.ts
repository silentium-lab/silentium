import { ensureFunction } from "../helpers";
import { DestroyableType, EventType, EventUserType } from "../types";

type EventExecutor<T> = (user: EventUserType<T>) => void | (() => void);

export class Event<T> implements EventType<T>, DestroyableType {
  private mbDestructor: unknown;

  public constructor(private eventExecutor: EventExecutor<T>) {
    ensureFunction(eventExecutor, "Event: eventExecutor");
  }

  public event(user: EventUserType<T>) {
    this.mbDestructor = this.eventExecutor(user);
    return this;
  }

  public destroy() {
    if (typeof this.mbDestructor === "function") {
      this.mbDestructor?.();
    }
    return this;
  }
}
