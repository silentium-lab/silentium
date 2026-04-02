import { DestroyContainer } from "base/DestroyContainer";
import { Message } from "base/Message";
import { isMessage } from "helpers/guards";
import { MaybeMessage, MessageType } from "types/MessageType";

/**
 * First message - is main
 * others will be destroyed when first
 * will be destroyed
 *
 * @url https://silentium.pw/article/connected/view
 */
export function Connected<T>(main: MessageType, ...m: MaybeMessage[]) {
  const dc = DestroyContainer();
  dc.add(main);
  dc.many(m);
  return Message<T>(function ConnectedImpl(resolve, reject) {
    (main as MessageType<T>).catch(reject).then(resolve);
    m.forEach(function connectedMessagesForEach(other) {
      if (isMessage(other)) {
        other.catch(reject);
      }
    });
    return dc.destructor();
  });
}
