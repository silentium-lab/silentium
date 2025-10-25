import { EventType, EventUserType } from "../types";

export class ExecutorApplied<T> implements EventType<T> {
  public constructor(
    private $base: EventType<T>,
    private applier: (executor: EventUserType<T>) => EventUserType<T>,
  ) {}

  public event(user: EventUserType<T>) {
    const ExecutorAppliedBaseUser = this.applier(user);
    this.$base.event(ExecutorAppliedBaseUser);
    return this;
  }
}
