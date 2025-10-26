import { EventTypeValue } from "../types/EventType";
import { EventType, EventUserType } from "../types";
import { ParentUser } from "../base/User";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
type Last<T extends any[]> = T extends [...infer _, infer L] ? L : never;

export class Chain<T extends EventType[]>
  implements EventType<EventTypeValue<Last<T>>>
{
  private $events: T;
  private lastValue: EventTypeValue<Last<T>> | undefined;

  public constructor(...events: T) {
    this.$events = events;
  }

  public event(user: EventUserType<EventTypeValue<Last<T>>>) {
    this.handleEvent(0, user);
    return this;
  }

  private handleEvent = (index: number, user: EventUserType) => {
    const event = this.$events[index] as Last<T>;
    const nextI = this.$events[index + 1] as Last<T> | undefined;
    event.event(this.oneEventUser.child(user, nextI, index));
  };

  private oneEventUser = new ParentUser(
    (
      v: EventTypeValue<Last<T>>,
      child,
      nextI: Last<T> | undefined,
      index: number,
    ) => {
      if (!nextI) {
        this.lastValue = v as EventTypeValue<Last<T>>;
      }

      if (this.lastValue) {
        child.use(this.lastValue);
      }

      if (nextI && !this.lastValue) {
        this.handleEvent(index + 1, child);
      }
    },
  );
}
