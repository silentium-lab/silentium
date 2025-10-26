import { ensureEvent } from "../helpers";
import { ParentUser } from "../base/User";
import { DestroyableType, EventType, EventUserType } from "../types";

/**
 * Create local copy of source what can be destroyed
 */
export class Local<T> implements EventType<T>, DestroyableType {
  private destroyed = false;

  public constructor(private $base: EventType<T>) {
    ensureEvent($base, "Local: $base");
  }

  public event(user: EventUserType<T>): this {
    this.$base.event(this.user.child(user));
    return this;
  }

  private user = new ParentUser((v: T, child: EventUserType<T>) => {
    if (!this.destroyed) {
      child.use(v);
    }
  });

  public destroy(): this {
    return this;
  }
}
