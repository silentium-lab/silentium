import { MaybeMessage } from "types/MessageType";
import { All } from "components/All";
import { Actual } from "base/Actual";
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
  const $emitter = Actual(emitter);
  const $eventName = Actual(eventName);
  const $subscribeMethod = Actual(subscribeMethod);
  const $unsubscribeMethod = Actual(unsubscribeMethod);
  return Message<T>((resolve, reject) => {
    $emitter.catch(reject);
    $eventName.catch(reject);
    $subscribeMethod.catch(reject);
    $unsubscribeMethod.catch(reject);
    let lastR: ConstructorType<[T]> | null = null;
    const handler = (v: T) => {
      if (lastR) {
        lastR(v);
      }
    };
    All($emitter, $eventName, $subscribeMethod).then(
      ([emitter, eventName, subscribe]) => {
        lastR = resolve;
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
