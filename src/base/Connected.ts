import { DestroyContainer } from "base/DestroyContainer";
import { Message } from "base/Message";
import { MessageType } from "types/MessageType";

/**
 * First message - is main
 * others will be destroyed when first
 * will be destroyed
 */
export function Connected(...m: MessageType[]) {
  return Message((resolve, reject) => {
    m[0].catch(reject).then(resolve);
    m.slice(1).forEach((other) => {
      other.catch(reject);
    });
    const dc = DestroyContainer();
    dc.many(m);

    return dc.destructor();
  });
}
