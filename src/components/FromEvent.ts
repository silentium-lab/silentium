import { ParentUser, User } from "../base/User";
import { EventType, EventUserType } from "../types";
import { DestroyableType } from "../types/EventType";
import { All } from "./All";

export class FromEvent<T> implements EventType<T>, DestroyableType {
  private lastUser: EventUserType<T> | null = null;
  private handler = (v: T) => {
    if (this.lastUser) {
      this.lastUser.use(v);
    }
  };

  public constructor(
    private $emitter: EventType<any>,
    private $eventName: EventType<string>,
    private $subscribeMethod: EventType<string>,
    private $unsubscribeMethod?: EventType<string>,
  ) {}

  public event(user: EventUserType<T>): this {
    const a = new All(this.$emitter, this.$eventName, this.$subscribeMethod);
    a.event(this.parent.child(user));
    return this;
  }

  private parent = new ParentUser<[any, string, string]>(
    ([emitter, eventName, subscribe], parent) => {
      this.lastUser = parent;
      if (!emitter?.[subscribe]) {
        return;
      }
      emitter[subscribe](eventName, this.handler);
    },
  );

  public destroy(): this {
    this.lastUser = null;
    if (!this.$unsubscribeMethod) {
      return this;
    }
    const a = new All(this.$emitter, this.$eventName, this.$unsubscribeMethod);
    a.event(
      new User(([emitter, eventName, unsubscribe]) => {
        emitter?.[unsubscribe]?.(eventName, this.handler);
      }),
    );
    return this;
  }
}
