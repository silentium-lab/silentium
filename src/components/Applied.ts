import { ActualMessage } from "base/ActualMessage";
import { DestroyContainer } from "base/DestroyContainer";
import { Message } from "base/Message";
import { isMessage } from "helpers/guards";
import { ConstructorType } from "types/ConstructorType";
import { MaybeMessage } from "types/MessageType";

/**
 * An message that applies a function
 * to the value of the base message
 *
 * @url https://silentium.pw/article/applied/view
 */
export function Applied<const T, R>(
  base: MaybeMessage<T>,
  applier: ConstructorType<[T], MaybeMessage<R>>,
) {
  const $base = ActualMessage(base);
  return Message<R>(function AppliedImpl(resolve, reject) {
    const dc = DestroyContainer();
    $base.catch(reject);
    $base.then((v) => {
      const result = applier(v);
      if (isMessage(result)) {
        dc.destroy();
        result.catch(reject).then(resolve);
      } else {
        resolve(result);
      }
    });
  });
}
