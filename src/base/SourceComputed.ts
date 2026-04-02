import { Source } from "base/Source";
import { MessageType } from "types/MessageType";
import { SourceType } from "types/SourceType";

export function SourceComputed<T>(
  message: MessageType<T>,
  source: SourceType<T>,
) {
  return Source<T>(
    function sourceComputedMsgExecutor(resolve, reject) {
      return message.then(resolve).catch(reject);
    },
    function sourceComputedSrcExecutor(v) {
      source.use(v);
    },
  );
}
