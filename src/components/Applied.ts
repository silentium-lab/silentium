import { ensureEvent } from "../helpers";
import { ParentUser } from "../base/User";
import { ConstructorType, EventType, EventUserType } from "../types";

export function Applied<T, R>(
  $base: EventType<T>,
  applier: ConstructorType<[T], R>,
) {
  return new TheApplied<T, R>($base, applier);
}

export class TheApplied<T, R> implements EventType<R> {
  public constructor(
    private $base: EventType<T>,
    private applier: ConstructorType<[T], R>,
  ) {
    ensureEvent($base, "Applied: base");
  }

  public event(user: EventUserType<R>) {
    this.$base.event(this.user.child(user));
    return this;
  }

  private user = new ParentUser((v: T, child) => {
    child.use(this.applier(v));
  });
}
