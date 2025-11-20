import { Message } from "base/Message";

/**
 * Helps convert a value into a message
 */
export function Of<T>(value: T) {
  return Message<T>(function OfImpl(r) {
    r(value);
  });
}
