import { EventType, EventUserType } from "../types";

type EventExecutor = <T>(user: EventUserType<T>) => void;

export class Event<T> implements EventType<T> {
  public constructor(private eventExecutor: EventExecutor) {}

  public event(user: EventUserType<T>) {
    this.eventExecutor(user);
    return this;
  }
}
