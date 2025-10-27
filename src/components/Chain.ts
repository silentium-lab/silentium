import { EventTypeValue } from "../types/EventType";
import { EventType, TransportType } from "../types";
import { ParentTransport } from "../base/Transport";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
type Last<T extends any[]> = T extends [...infer _, infer L] ? L : never;

/**
 * Chains events together and triggers
 * the last event only when all previous events
 * have emitted their values. The value of Chain will be the value
 * of the last event. If any events
 * emit a value again after the overall Chain response was already returned,
 * then Chain emits again with the value of the last event.
 */
export function Chain<T extends EventType[]>(...events: T) {
  return new TheChain<T>(...events);
}

export class TheChain<T extends EventType[]>
  implements EventType<EventTypeValue<Last<T>>>
{
  private $events: T;
  private lastValue: EventTypeValue<Last<T>> | undefined;

  public constructor(...events: T) {
    this.$events = events;
  }

  public event(transport: TransportType<EventTypeValue<Last<T>>>) {
    this.handleEvent(0, transport);
    return this;
  }

  private handleEvent = (index: number, transport: TransportType) => {
    const event = this.$events[index] as Last<T>;
    const nextI = this.$events[index + 1] as Last<T> | undefined;
    event.event(this.oneEventTransport.child(transport, nextI, index));
  };

  private oneEventTransport = new ParentTransport(
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
