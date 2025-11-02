import { TransportType } from "../types/TransportType";
import { TransportParent } from "../base/Transport";
import { EventType, EventTypeValue } from "../types/EventType";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
type Last<T extends readonly any[]> = T extends readonly [...infer _, infer L]
  ? L
  : never;

/**
 * Chains events together and triggers
 * the last event only when all previous events
 * have emitted their values. The value of Chain will be the value
 * of the last event. If any events
 * emit a value again after the overall Chain response was already returned,
 * then Chain emits again with the value of the last event.
 */
export function Chain<T extends readonly EventType[]>(...events: T) {
  return new ChainEvent<T>(...events);
}

export class ChainEvent<T extends readonly EventType[]>
  implements EventType<EventTypeValue<Last<T>>>
{
  private $events: T;
  private $latest: EventTypeValue<Last<T>> | undefined;

  public constructor(...events: T) {
    this.$events = events;
  }

  public event(transport: TransportType<EventTypeValue<Last<T>>>) {
    this.handleEvent(0, transport);
    return this;
  }

  private handleEvent = (index: number, transport: TransportType) => {
    const event = this.$events[index] as Last<T>;
    const next = this.$events[index + 1] as Last<T> | undefined;
    event.event(this.oneEventTransport.child(transport, next, index));
  };

  private oneEventTransport = TransportParent(function (
    v: EventTypeValue<Last<T>>,
    child: ChainEvent<T>,
    next: Last<T> | undefined,
    index: number,
  ) {
    if (!next) {
      child.$latest = v as EventTypeValue<Last<T>>;
    }
    if (child.$latest) {
      this.use(child.$latest);
    }
    if (next && !child.$latest) {
      child.handleEvent(index + 1, this);
    }
  }, this);
}
