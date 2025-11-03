import { EventType } from "types/EventType";
import { All } from "components/All";
import { TransportType } from "types/TransportType";
import { isEvent } from "helpers/guards";
import { TransportParent } from "base/Transport";
import { Of } from "base/Of";

/**
 * Component that applies an info object constructor to each data item,
 * producing an information source with new values
 */
export function Map<T, TG>(
  $base: EventType<T[]>,
  $target: TransportType<any, EventType<TG>>,
) {
  return new MapEvent<T, TG>($base, $target);
}

export class MapEvent<T, TG> implements EventType<TG[]> {
  public constructor(
    private $base: EventType<T[]>,
    private $target: TransportType<any, EventType<TG>>,
  ) {}

  public event(transport: TransportType<TG[]>): this {
    this.$base.event(this.parent.child(transport));
    return this;
  }

  private parent = TransportParent<T[]>(function (v, child) {
    const infos: EventType<TG>[] = [];
    v.forEach((val) => {
      let $val: EventType<T> | T = val;
      if (!isEvent($val as object)) {
        $val = Of($val);
      }
      const info = child.$target.use($val);
      infos.push(info);
    });
    All(...infos).event(this);
  }, this);
}
