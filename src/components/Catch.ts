import { ensureEvent, ensureUser } from "../helpers";
import { EventType, EventUserType } from "../types";

export class Catch<T> implements EventType<T> {
  public constructor(
    private $base: EventType<T>,
    private errorMessage: EventUserType,
    private errorOriginal?: EventUserType,
  ) {
    ensureEvent($base, "Catch: base");
    ensureUser(errorMessage, "Catch: errorMessage");
    if (errorOriginal !== undefined) {
      ensureUser(errorOriginal, "Catch: errorOriginal");
    }
  }

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
