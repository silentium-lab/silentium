import { MaybeMessage } from "types/MessageType";
import { All } from "components/All";
import { ActualMessage } from "base/ActualMessage";
import { Message } from "base/Message";
import { ConstructorType } from "types/ConstructorType";

/**
 * A message derived from event with a different
 * method call interface, based on callbacks.
 * Allows attaching a custom handler to an existing event source
 * and presenting it as a silentium message
 */
export function FromEvent<T>(
  emitter: MaybeMessage<any>,
  eventName: MaybeMessage<string>,
  subscribeMethod: MaybeMessage<string>,
  unsubscribeMethod?: MaybeMessage<string>,
) {
  const $emitter = ActualMessage(emitter);
  const $eventName = ActualMessage(eventName);
  const $subscribeMethod = ActualMessage(subscribeMethod);
  const $unsubscribeMethod = ActualMessage(unsubscribeMethod);
  return Message<T>((r) => {
    let lastR: ConstructorType<[T]> | null = null;
    const handler = (v: T) => {
      if (lastR) {
        lastR(v);
      }
    };
    All($emitter, $eventName, $subscribeMethod).then(
      ([emitter, eventName, subscribe]) => {
        lastR = r;
        if (!emitter?.[subscribe]) {
          return;
        }
        emitter[subscribe](eventName, handler);
      },
    );
    return () => {
      lastR = null;
      if (!$unsubscribeMethod) {
        return;
      }
      All($emitter, $eventName, $unsubscribeMethod).then(
        ([emitter, eventName, unsubscribe]) => {
          emitter?.[unsubscribe as string]?.(eventName, handler);
        },
      );
    };
  });
}
