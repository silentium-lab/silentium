import { ParentUser } from "../base/User";
import { EventType, ConstructorType, EventUserType } from "../types";

export class Filtered<T> implements EventType<T> {
  public constructor(
    private $base: EventType<T>,
    private predicate: ConstructorType<[T], boolean>,
    private defaultValue?: T,
  ) {}

  public event(user: EventUserType<T>) {
    this.$base.event(this.parent.child(user));
    return this;
  }

  private parent = new ParentUser<T>((v, child) => {
    if (this.predicate(v)) {
      child.use(v);
    } else if (this.defaultValue !== undefined) {
      child.use(this.defaultValue);
    }
  });
}
