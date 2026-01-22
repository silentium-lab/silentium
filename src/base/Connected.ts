import { DestroyContainer } from "base/DestroyContainer";
import { Message } from "base/Message";
import { MessageType } from "types/MessageType";

/**
 * First message - is main
 * others will be destroyed when first
 * will be destroyed
 *
 * @url https://silentium.pw/article/connected/view
 */
export function Connected<T>(...m: MessageType[]) {
  const dc = DestroyContainer();
  dc.many(m);
  return Message<T>((resolve, reject) => {
    (m[0] as MessageType<T>).catch(reject).then(resolve);
    m.slice(1).forEach((other) => {
      other.catch(reject);
    });
    return dc.destructor();
  });
}
