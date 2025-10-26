import { ParentUser } from "../base";
import { EventType, EventUserType } from "../types";

/**
 * Limits the number of values from the information source
 * to a single value - once the first value is emitted, no more
 * values are delivered from the source
 * https://silentium-lab.github.io/silentium/#/en/information/once
 */
export class Once<T> implements EventType<T> {
  private isFilled = false;

  public constructor(private $base: EventType<T>) {}

  public event(user: EventUserType<T>): this {
    this.$base.event(this.parent.child(user));
    return this;
  }

  private parent = new ParentUser<T>((v, child) => {
    if (!this.isFilled) {
      this.isFilled = true;
      child.use(v);
    }
  });
}
