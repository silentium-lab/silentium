import { EventType, EventUserType } from "../types";

export class FromPromise<T> implements EventType<T> {
  public constructor(
    private p: Promise<T>,
    private errorOwner?: EventUserType,
  ) {}

  public event(user: EventUserType<T>): this {
    this.p
      .then(function FromPromiseThen(v) {
        user.use(v);
      })
      .catch((e) => {
        this.errorOwner?.use(e);
      });
    return this;
  }
}
