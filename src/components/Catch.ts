import { EventType, EventUserType } from "../types";

export class Catch<T> implements EventType<T> {
  public constructor(
    private $base: EventType<T>,
    private errorMessage: EventUserType,
    private errorOriginal?: EventUserType,
  ) {}

  public event(user: EventUserType<T>) {
    try {
      this.$base.event(user);
    } catch (e: any) {
      if (e instanceof Error) {
        this.errorMessage.use(e.message);
      } else {
        this.errorMessage.use(e);
      }
      if (this.errorOriginal) {
        this.errorOriginal.use(e);
      }
    }
    return this;
  }
}
