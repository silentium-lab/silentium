import { Late } from "components/Late";
import { Shared } from "components/Shared";

/**
 * An message with a value that will be set later,
 * capable of responding to different taps
 */
export function LateShared<T>(value?: T) {
  const l = Late(value);
  return Shared(l, l);
}
