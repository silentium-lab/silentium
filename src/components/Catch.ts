import { Message } from "base/Message";
import { ConstructorType } from "types/ConstructorType";
import { MessageType } from "types/MessageType";

/**
 * An message representing a base message where
 * its operation is wrapped in try-catch
 * and expects exceptions. If an exception
 * bubbles up, it's passed to the taps
 * as errorMessage and errorOriginal
 */
export function Catch<T>(
  $base: MessageType<T>,
  errorMessage: ConstructorType<[unknown]>,
  errorOriginal?: ConstructorType<[unknown]>,
) {
  return Message<T>((r) => {
    try {
      $base.then(r);
    } catch (e: unknown) {
      if (e instanceof Error) {
        errorMessage(e.message);
      } else {
        errorMessage(String(e));
      }
      if (errorOriginal) {
        errorOriginal(e);
      }
    }
  });
}
