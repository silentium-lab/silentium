import { Local } from "base/Local";
import { MaybeMessage } from "types/MessageType";

export function Props(...messages: MaybeMessage[]) {
  return messages.map(function propsMap(m) {
    return Local(m);
  });
}
