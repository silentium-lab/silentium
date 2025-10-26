import { EventType, EventUserType } from "../types";

export function Of<T>(value: T) {
  return new TheOf<T>(value);
}

class TheOf<T> implements EventType<T> {
  public constructor(private value: T) {}

  public event(user: EventUserType<T>): this {
    user.use(this.value);
    return this;
  }
}
