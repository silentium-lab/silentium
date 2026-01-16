import { Primitive } from "components/Primitive";
import { MessageType } from "types/MessageType";

/**
 * Component what will return same proxied object
 * but with value property
 *
 * @url https://silentium.pw/article/value/view
 */
export function Value<T>(
  target: MessageType<T>,
): MessageType<T> & { value: T | null } {
  const p = Primitive(target);
  return new Proxy(target, {
    get(target, prop, receiver) {
      if (prop === "value") {
        return p.primitive();
      }
      return Reflect.get(target, prop, receiver);
    },
  }) as MessageType<T> & { value: T | null };
}
