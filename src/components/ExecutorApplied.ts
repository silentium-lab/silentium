import { Message } from "base/Message";
import { MessageType } from "types/MessageType";

type ExecutorApplier<T> = (executor: (v: T) => void) => (v: T) => void;

/**
 * Applies a value transfer function to the tap
 * and returns the same value transfer function for the tap
 * Useful for applying functions like debounced or throttle
 */
export function ExecutorApplied<T>(
  $base: MessageType<T>,
  applier: ExecutorApplier<T>,
) {
  return Message<T>(function ExecutorAppliedImpl(r) {
    $base.then(applier(r));
  });
}
