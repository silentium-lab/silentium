import { MaybeMessage, MessageType } from "types/MessageType";
import { All } from "components/All";
import { TapType } from "types/TapType";
import { isMessage } from "helpers/guards";
import { TapParent } from "base/Tap";
import { Of } from "base/Of";
import { ActualMessage } from "base/ActualMessage";

/**
 * Component that applies an info object constructor to each data item,
 * producing an information source with new values
 */
export function Map<T, TG>(
  $base: MaybeMessage<T[]>,
  $target: TapType<any, MessageType<TG>>,
) {
  return new MapImpl<T, TG>(ActualMessage($base), $target);
}

export class MapImpl<T, TG> implements MessageType<TG[]> {
  public constructor(
    private $base: MessageType<T[]>,
    private $target: TapType<any, MessageType<TG>>,
  ) {}

  public pipe(tap: TapType<TG[]>): this {
    this.$base.pipe(this.parent.child(tap));
    return this;
  }

  private parent = TapParent<T[]>(function (v, child) {
    const infos: MessageType<TG>[] = [];
    v.forEach((val) => {
      let $val: MessageType<T> | T = val;
      if (!isMessage($val as object)) {
        $val = Of($val);
      }
      const info = child.$target.use($val);
      infos.push(info);
    });
    All(...infos).pipe(this);
  }, this);
}
