import { Actual } from "base/ActualMessage";
import { MaybeMessage } from "types/MessageType";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
type Last<T extends readonly any[]> = T extends readonly [...infer _, infer L]
  ? L extends (...args: any) => any
    ? L
    : never
  : never;

/**
 * Helps to pipe actors or functions to one common actor
 *
 * @url https://silentium.pw/article/piped/view
 */
export function Piped<T extends ((...vars: any) => MaybeMessage)[]>(
  $m: MaybeMessage,
  ...c: T
) {
  return c.reduce((msg, Constructor) => {
    return Actual(Constructor(msg));
  }, Actual($m)) as ReturnType<Last<T>>;
}
