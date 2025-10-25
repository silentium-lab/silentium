import { EventUserType } from "../types";

export class User<T> implements EventUserType<T> {
  public constructor(private userExecutor: (v: T) => void) {}

  public use(value: T) {
    this.userExecutor(value);
    return this;
  }
}

export class ParentUser<T> implements EventUserType<T> {
  private baseUser?: EventUserType<T>;

  public constructor(
    private userExecutor: (v: T, user: EventUserType, ...args: any[]) => void,
    private args: any[] = [],
  ) {}

  public use(value: T): this {
    if (this.baseUser === undefined) {
      throw new Error("no base user");
    }
    this.userExecutor(value, this.baseUser, ...this.args);
    return this;
  }

  public child(user: EventUserType, ...args: any[]) {
    this.baseUser = user;
    this.args = args;
    return this;
  }
}
