import { ParentUser } from "../base";
import { EventType, EventUserType } from "../types";

/**
 * Component that receives a data array and yields values one by one
 * https://silentium-lab.github.io/silentium/#/en/information/stream
 */
export class Stream<T> implements EventType<T> {
  public constructor(private $base: EventType<T[]>) {}

  public event(user: EventUserType<T>): this {
    this.$base.event(this.parent.child(user));
    return this;
  }

  private parent = new ParentUser<T[]>((v, child) => {
    v.forEach((cv) => {
      child.use(cv);
    });
  });
}
