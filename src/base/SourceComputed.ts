import { Source } from "base/Source";
import { MessageType } from "types/MessageType";
import { SourceType } from "types/SourceType";

export function SourceComputed<T>(
  message: MessageType<T>,
  source: SourceType<T>,
) {
  return Source<T>(
    (resolve, reject) => message.then(resolve).catch(reject),
    (v) => source.use(v),
  );
}
