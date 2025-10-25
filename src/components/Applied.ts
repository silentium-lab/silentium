import { ParentUser } from "../base/User";
import { ConstructorType, EventType, EventUserType } from "../types";

export class Applied<T, R> implements EventType<R> {
  public constructor(
    private $base: EventType<T>,
    private applier: ConstructorType<[T], R>,
  ) {}

  public event(user: EventUserType<R>) {
    this.$base.event(this.user.child(user));
    return this;
  }

  private user = new ParentUser((v: T, child) => {
    child.use(this.applier(v));
  });
}
