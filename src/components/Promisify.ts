import { MessageType } from "types/MessageType";

/**
 * Convert message to promise
 */
export function Promisify<T>($message: MessageType<T>) {
  return new Promise((resolve, reject) => {
    $message.then(resolve, reject);
  });
}
