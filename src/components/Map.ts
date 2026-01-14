import { MaybeMessage, MessageType } from "types/MessageType";
import { All } from "components/All";
import { isMessage } from "helpers/guards";
import { Of } from "base/Of";
import { ConstructorType } from "types/ConstructorType";
import { Message } from "base/Message";
import { Actual } from "base/ActualMessage";
import { DestroyContainer } from "base/DestroyContainer";

/**
 * Component that applies an info object constructor to each data item,
 * producing an information source with new values
 *
 * @url https://silentium.pw/article/map/view
 */
export function Map<T, TG>(
  base: MaybeMessage<T[]>,
  target: ConstructorType<[any], MessageType<TG>>,
) {
  const $base = Actual(base);
  return Message<TG[]>((resolve, reject) => {
    $base.catch(reject);
    const infos: MessageType<TG>[] = [];
    const dc = DestroyContainer();
    $base.then((v) => {
      infos.length = 0;
      dc.destroy();
      v.forEach((val) => {
        let $val: MessageType<T> | T = val;
        if (!isMessage($val as object)) {
          $val = Of($val);
        }
        const info = target($val);
        dc.add(info);
        infos.push(info);
      });
      All(...infos).then(resolve);
    });
  });
}
