import { Late } from "components/Late";
import { Shared } from "components/Shared";

/**
 * An message with a value that will be set later,
 * capable of responding to many resolvers
 */
export function LateShared<T>(value?: T) {
  const l = Late(value);
  return Shared(l);
}
