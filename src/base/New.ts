import { Message } from "base/Message";
import { ConstructorType } from "types/ConstructorType";

/**
 * A component that, on each access, returns a new instance
 * of a reference type based on the constructor function
 *
 * @url https://silentium.pw/article/new-component/view
 */
export function New<T>(construct: ConstructorType<[], T>) {
  return Message<T>(function NewImpl(resolve) {
    resolve(construct());
  });
}
