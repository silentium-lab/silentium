import { All } from "components/All";
import { Destructured } from "components/Destructured";
import { ConstructorType } from "types/ConstructorType";
import { MaybeMessage } from "types/MessageType";

/**
 * Component what helps to compute
 * poor functions, and represent result
 * as message
 *
 * @url https://silentium.pw/article/computed/view
 */
export function Computed<const T extends MaybeMessage<any>[], R>(
  applier: ConstructorType<any[], R>,
  ...messages: T
) {
  return Destructured(All(...messages), applier);
}
