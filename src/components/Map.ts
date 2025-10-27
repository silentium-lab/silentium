import { isEvent } from "../helpers";
import { Of, ParentTransport } from "../base";
import { EventType, TransportType } from "../types";
import { All } from "./All";

/**
 * Component that applies an info object constructor to each data item,
 * producing an information source with new values
 */
export function Map<T, TG>(
  $base: EventType<T[]>,
  $target: TransportType<any, EventType<TG>>,
) {
  return new TheMap<T, TG>($base, $target);
}

class TheMap<T, TG> implements EventType<TG[]> {
  public constructor(
    private $base: EventType<T[]>,
    private $target: TransportType<any, EventType<TG>>,
  ) {}

  public event(transport: TransportType<TG[]>): this {
    this.$base.event(this.parent.child(transport));
    return this;
  }

  private parent = new ParentTransport<T[]>((v, child) => {
    const infos: EventType<TG>[] = [];
    v.forEach((val) => {
      let valInfo: EventType<T> | T = val;
      if (!isEvent(valInfo as object)) {
        valInfo = Of(valInfo);
      }
      const info = this.$target.use(valInfo);
      infos.push(info);
    });
    const allI = All(...infos);
    allI.event(child);
  });
}
