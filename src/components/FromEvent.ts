import { TransportType } from "types/TransportType";
import { Transport, TransportParent } from "base/Transport";
import { EventType } from "types/EventType";
import { All } from "components/All";
import { DestroyableType } from "types/DestroyableType";

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
  return new FromEventAdapter<T>(
    $emitter,
    $eventName,
    $subscribeMethod,
    $unsubscribeMethod,
  );
}

export class FromEventAdapter<T> implements EventType<T>, DestroyableType {
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
    All(this.$emitter, this.$eventName, this.$subscribeMethod).event(
      this.parent.child(transport),
    );
    return this;
  }

  private parent = TransportParent<[any, string, string]>(function (
    [emitter, eventName, subscribe],
    child,
  ) {
    child.lastTransport = this;
    if (!emitter?.[subscribe]) {
      return;
    }
    emitter[subscribe](eventName, child.handler);
  }, this);

  public destroy(): this {
    this.lastTransport = null;
    if (!this.$unsubscribeMethod) {
      return this;
    }
    All(this.$emitter, this.$eventName, this.$unsubscribeMethod).event(
      Transport(([emitter, eventName, unsubscribe]) => {
        emitter?.[unsubscribe]?.(eventName, this.handler);
      }),
    );
    return this;
  }
}
