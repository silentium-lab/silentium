import { ensureFunction } from "../helpers";
import { EventUserType } from "../types";

export function User<T>(userExecutor: (v: T) => void) {
  return new TheUser<T>(userExecutor);
}

class TheUser<T> implements EventUserType<T> {
  public constructor(private userExecutor: (v: T) => void) {
    ensureFunction(userExecutor, "User: user executor");
  }

  public use(value: T) {
    this.userExecutor(value);
    return this;
  }
}

export class ParentUser<T> implements EventUserType<T> {
  public constructor(
    private userExecutor: (v: T, user: EventUserType, ...args: any[]) => void,
    private args: any[] = [],
    private childUser?: EventUserType<T>,
  ) {
    ensureFunction(userExecutor, "ParentUser: executor");
  }

  public use(value: T): this {
    if (this.childUser === undefined) {
      throw new Error("no base user");
    }
    this.userExecutor(value, this.childUser, ...this.args);
    return this;
  }

  public child(user: EventUserType, ...args: any[]) {
    return new ParentUser(this.userExecutor, [...this.args, ...args], user);
  }
}
