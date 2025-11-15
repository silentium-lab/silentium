import { TransportType } from "types/TransportType";
import { Transport, TransportParent } from "base/Transport";
import { MessageType } from "types/MessageType";
import { All } from "components/All";
import { DestroyableType } from "types/DestroyableType";

/**
 * A message derived from event with a different
 * method call interface, based on callbacks.
 * Allows attaching a custom handler to an existing event source
 * and presenting it as a silentium message
 */
export function FromEvent<T>(
  $emitter: MessageType<any>,
  $eventName: MessageType<string>,
  $subscribeMethod: MessageType<string>,
  $unsubscribeMethod?: MessageType<string>,
) {
  return new FromEventImpl<T>(
    $emitter,
    $eventName,
    $subscribeMethod,
    $unsubscribeMethod,
  );
}

export class FromEventImpl<T> implements MessageType<T>, DestroyableType {
  private lastTransport: TransportType<T> | null = null;
  private handler = (v: T) => {
    if (this.lastTransport) {
      this.lastTransport.use(v);
    }
  };

  public constructor(
    private $emitter: MessageType<any>,
    private $eventName: MessageType<string>,
    private $subscribeMethod: MessageType<string>,
    private $unsubscribeMethod?: MessageType<string>,
  ) {}

  public to(transport: TransportType<T>): this {
    All(this.$emitter, this.$eventName, this.$subscribeMethod).to(
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
    All(this.$emitter, this.$eventName, this.$unsubscribeMethod).to(
      Transport(([emitter, eventName, unsubscribe]) => {
        emitter?.[unsubscribe]?.(eventName, this.handler);
      }),
    );
    return this;
  }
}
