import { isFilled } from "../helpers";
import { EventUserType, SourceType } from "../types";

/**
 * A component that allows creating linked objects of information and its owner
 * in such a way that if a new value is assigned to the owner, this value
 * will become the value of the linked information source
 * https://silentium-lab.github.io/silentium/#/en/information/of
 */
export class Late<T> implements SourceType<T> {
  private lateUser: EventUserType<T> | null = null;
  private notify = (v?: T) => {
    if (isFilled(v) && this.lateUser) {
      this.lateUser.use(v);
    }
  };

  public constructor(private v?: T) {}

  public event(user: EventUserType<T>): this {
    if (this.lateUser) {
      throw new Error(
        "Late component gets new user, when another was already connected!",
      );
    }
    this.lateUser = user;
    this.notify(this.v);
    return this;
  }

  public use(value: T): this {
    this.notify(value);
    return this;
  }
}
