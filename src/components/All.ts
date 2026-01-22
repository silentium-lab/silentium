import { Actual } from "base/Actual";
import { Message } from "base/Message";
import { MaybeMessage } from "types/MessageType";

type ExtractTypeS<T> = T extends MaybeMessage<infer U> ? U : never;

type ExtractTypesFromArrayS<T extends MaybeMessage<any>[]> = {
  [K in keyof T]: ExtractTypeS<T[K]>;
};

const isAllFilled = (keysFilled: Set<string>, keysKnown: Set<string>) => {
  return keysFilled.size > 0 && keysFilled.size === keysKnown.size;
};

/**
 * A message that represents values from
 * all provided messages as an array.
 * When all messages emit their values,
 * the combined value will be returned.
 * If at least one message later emits a new
 * value, the updated array with the new value
 * will be emitted by All.
 *
 * @url https://silentium.pw/article/all-component/view
 */
export function All<const T extends MaybeMessage[]>(...messages: T) {
  const $messages = messages.map(Actual);
  return Message<ExtractTypesFromArrayS<T>>(function AllImpl(resolve, reject) {
    const known = new Set<string>(Object.keys(messages));
    const filled = new Set<string>();
    const result: unknown[] = [];
    if (known.size === 0) {
      resolve([] as ExtractTypesFromArrayS<T>);
      return;
    }
    $messages.map((m, key) => {
      m.catch(reject);
      m.then((v) => {
        filled.add(key.toString());
        result[key] = v;
        if (isAllFilled(filled, known)) {
          resolve(result.slice() as ExtractTypesFromArrayS<T>);
        }
      });
    });
  });
}
