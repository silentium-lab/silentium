import { Late } from "../components/Late";
import { SharedSource } from "../components/SharedSource";
import { EventUserType, SourceType } from "../types";

export class LateShared<T> implements SourceType<T> {
  private $event: SharedSource<T>;

  public constructor(value?: T) {
    this.$event = new SharedSource(new Late(value));
  }

  public event(user: EventUserType<T>) {
    this.$event.event(user);
    return this;
  }

  public use(value: T) {
    this.$event.use(value);
    return this;
  }
}
