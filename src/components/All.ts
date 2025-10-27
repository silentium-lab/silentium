import { ParentTransport } from "../base/Transport";
import { ensureEvent } from "../helpers";
import { EventType, TransportType } from "../types";

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
  return new TheAll<T>(...events);
}

class TheAll<const T extends EventType[]>
  implements EventType<ExtractTypesFromArrayS<T>>
{
  private keysKnown: Set<string>;
  private keysFilled = new Set<string>();
  private $events: T;
  private result: Record<string, unknown> = {};

  public constructor(...events: T) {
    this.keysKnown = new Set<string>(Object.keys(events));
    this.$events = events;
  }

  public event(transport: TransportType<ExtractTypesFromArrayS<T>>): this {
    Object.entries(this.$events).forEach(([key, event]) => {
      ensureEvent(event, "All: item");
      this.keysKnown.add(key);
      event.event(this.transport.child(transport, key));
    });
    return this;
  }

  private transport = new ParentTransport(
    (v: T, child: TransportType, key: string) => {
      this.keysFilled.add(key);
      this.result[key] = v;
      if (isAllFilled(this.keysFilled, this.keysKnown)) {
        child.use(Object.values(this.result) as ExtractTypesFromArrayS<T>);
      }
    },
  );
}
