import { ParentUser } from "../base";
import { EventType, EventUserType } from "../types";

/**
 * A component that takes one value at a time and returns
 * an array of all previous values
 * https://silentium-lab.github.io/silentium/#/en/information/sequence
 */
export class Sequence<T> implements EventType<T[]> {
  private result: T[] = [];

  public constructor(private $base: EventType<T>) {}

  public event(user: EventUserType<T[]>): this {
    this.$base.event(this.parent.child(user));
    return this;
  }

  private parent = new ParentUser<T>((v, child) => {
    this.result.push(v);
    child.use(this.result);
  });
}
