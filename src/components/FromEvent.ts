import { TapType } from "types/TapType";
import { Tap, TapParent } from "base/Tap";
import { MaybeMessage, MessageType } from "types/MessageType";
import { All } from "components/All";
import { DestroyableType } from "types/DestroyableType";
import { ActualMessage } from "base/ActualMessage";

/**
 * A message derived from event with a different
 * method call interface, based on callbacks.
 * Allows attaching a custom handler to an existing event source
 * and presenting it as a silentium message
 */
export function FromEvent<T>(
  $emitter: MaybeMessage<any>,
  $eventName: MaybeMessage<string>,
  $subscribeMethod: MaybeMessage<string>,
  $unsubscribeMethod?: MaybeMessage<string>,
) {
  return new FromEventImpl<T>(
    ActualMessage($emitter),
    ActualMessage($eventName),
    ActualMessage($subscribeMethod),
    ActualMessage($unsubscribeMethod),
  );
}

export class FromEventImpl<T> implements MessageType<T>, DestroyableType {
  private lastTap: TapType<T> | null = null;
  private handler = (v: T) => {
    if (this.lastTap) {
      this.lastTap.use(v);
    }
  };

  public constructor(
    private $emitter: MessageType<any>,
    private $eventName: MessageType<string>,
    private $subscribeMethod: MessageType<string>,
    private $unsubscribeMethod?: MessageType<string>,
  ) {}

  public pipe(tap: TapType<T>): this {
    All(this.$emitter, this.$eventName, this.$subscribeMethod).pipe(
      this.parent.child(tap),
    );
    return this;
  }

  private parent = TapParent<[any, string, string]>(function (
    [emitter, eventName, subscribe],
    child,
  ) {
    child.lastTap = this;
    if (!emitter?.[subscribe]) {
      return;
    }
    emitter[subscribe](eventName, child.handler);
  }, this);

  public destroy(): this {
    this.lastTap = null;
    if (!this.$unsubscribeMethod) {
      return this;
    }
    All(this.$emitter, this.$eventName, this.$unsubscribeMethod).pipe(
      Tap(([emitter, eventName, unsubscribe]) => {
        emitter?.[unsubscribe]?.(eventName, this.handler);
      }),
    );
    return this;
  }
}
