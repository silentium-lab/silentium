import { MaybeMessage, MessageType } from "types/MessageType";
import { All } from "components/All";
import { TransportType } from "types/TransportType";
import { isMessage } from "helpers/guards";
import { TransportParent } from "base/Transport";
import { Of } from "base/Of";
import { ActualMessage } from "base/ActualMessage";

/**
 * Component that applies an info object constructor to each data item,
 * producing an information source with new values
 */
export function Map<T, TG>(
  $base: MaybeMessage<T[]>,
  $target: TransportType<any, MessageType<TG>>,
) {
  return new MapImpl<T, TG>(ActualMessage($base), $target);
}

export class MapImpl<T, TG> implements MessageType<TG[]> {
  public constructor(
    private $base: MessageType<T[]>,
    private $target: TransportType<any, MessageType<TG>>,
  ) {}

  public to(transport: TransportType<TG[]>): this {
    this.$base.to(this.parent.child(transport));
    return this;
  }

  private parent = TransportParent<T[]>(function (v, child) {
    const infos: MessageType<TG>[] = [];
    v.forEach((val) => {
      let $val: MessageType<T> | T = val;
      if (!isMessage($val as object)) {
        $val = Of($val);
      }
      const info = child.$target.use($val);
      infos.push(info);
    });
    All(...infos).to(this);
  }, this);
}
