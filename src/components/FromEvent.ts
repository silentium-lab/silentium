import { ParentTransport, Transport } from "../base/Transport";
import { EventType, TransportType } from "../types";
import { DestroyableType } from "../types/EventType";
import { All } from "./All";

/**
 * An event derived from another event with a different
 * method call interface, based on callbacks.
 * Allows attaching a custom handler to an existing event source
 * and presenting it as a silentium event
 */
export function FromEvent<T>(
  $emitter: EventType<any>,
  $eventName: EventType<string>,
  $subscribeMethod: EventType<string>,
  $unsubscribeMethod?: EventType<string>,
) {
  return new TheFromEvent<T>(
    $emitter,
    $eventName,
    $subscribeMethod,
    $unsubscribeMethod,
  );
}

class TheFromEvent<T> implements EventType<T>, DestroyableType {
  private lastTransport: TransportType<T> | null = null;
  private handler = (v: T) => {
    if (this.lastTransport) {
      this.lastTransport.use(v);
    }
  };

  public constructor(
    private $emitter: EventType<any>,
    private $eventName: EventType<string>,
    private $subscribeMethod: EventType<string>,
    private $unsubscribeMethod?: EventType<string>,
  ) {}

  public event(transport: TransportType<T>): this {
    const a = All(this.$emitter, this.$eventName, this.$subscribeMethod);
    a.event(this.parent.child(transport));
    return this;
  }

  private parent = new ParentTransport<[any, string, string]>(
    ([emitter, eventName, subscribe], parent) => {
      this.lastTransport = parent;
      if (!emitter?.[subscribe]) {
        return;
      }
      emitter[subscribe](eventName, this.handler);
    },
  );

  public destroy(): this {
    this.lastTransport = null;
    if (!this.$unsubscribeMethod) {
      return this;
    }
    const a = All(this.$emitter, this.$eventName, this.$unsubscribeMethod);
    a.event(
      Transport(([emitter, eventName, unsubscribe]) => {
        emitter?.[unsubscribe]?.(eventName, this.handler);
      }),
    );
    return this;
  }
}
