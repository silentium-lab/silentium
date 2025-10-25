import { EventType, EventUserType } from "../types";

export class Of<T> implements EventType<T> {
  public constructor(private value: T) {}

  public event(user: EventUserType<T>): this {
    user.use(this.value);
    return this;
  }
}
