import { All } from "components/All";
import { AppliedDestructured } from "components/AppliedDestructured";
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
  return AppliedDestructured(All(...messages), applier);
}
