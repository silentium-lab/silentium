import { Message } from "base/Message";
import { MessageType } from "types/MessageType";

type ExecutorApplier<T> = (executor: (v: T) => void) => (v: T) => void;

/**
 * Applies a value transfer function to the resolver
 * and returns the same value transfer function for the resolver
 * Useful for applying functions like debounced or throttle
 */
export function ExecutorApplied<T>(
  $base: MessageType<T>,
  applier: ExecutorApplier<T>,
) {
  return Message<T>(function ExecutorAppliedImpl(resolve, reject) {
    $base.catch(reject);
    $base.then(applier(resolve));
  });
}
