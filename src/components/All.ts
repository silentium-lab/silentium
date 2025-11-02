import { EventType } from "../types/EventType";
import { TransportParent } from "../base/Transport";
import { TransportType } from "../types/TransportType";
import { ensureEvent } from "../helpers/ensures";

type ExtractTypeS<T> = T extends EventType<infer U> ? U : never;

type ExtractTypesFromArrayS<T extends EventType<any>[]> = {
  [K in keyof T]: ExtractTypeS<T[K]>;
};

const isAllFilled = (keysFilled: Set<string>, keysKnown: Set<string>) => {
  return keysFilled.size > 0 && keysFilled.size === keysKnown.size;
};

/**
 * An event that represents values from
 * all provided events as an array.
 * When all events emit their values,
 * the combined value will be returned.
 * If at least one event later emits a new
 * value, the updated array with the new value
 * will be emitted by All.
 */
export function All<const T extends EventType[]>(...events: T) {
  return new AllEvent<T>(...events);
}

class AllEvent<const T extends EventType[]>
  implements EventType<ExtractTypesFromArrayS<T>>
{
  private known: Set<string>;
  private filled = new Set<string>();
  private $events: T;
  private result: unknown[] = [];

  public constructor(...events: T) {
    this.known = new Set<string>(Object.keys(events));
    this.$events = events;
  }

  public event(transport: TransportType<ExtractTypesFromArrayS<T>>): this {
    Object.entries(this.$events).forEach(([key, event]) => {
      ensureEvent(event, "All: item");
      event.event(this.transport.child(transport, key));
    });
    if (this.known.size === 0) {
      transport.use([] as ExtractTypesFromArrayS<T>);
    }
    return this;
  }

  private transport = TransportParent(function (
    v: unknown,
    child: AllEvent<T>,
    key: string,
  ) {
    child.filled.add(key);
    child.result[parseInt(key)] = v;
    if (isAllFilled(child.filled, child.known)) {
      this.use(child.result as ExtractTypesFromArrayS<T>);
    }
  }, this);
}
