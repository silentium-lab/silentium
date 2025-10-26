import { isEvent } from "src/helpers";
import { Of, ParentUser } from "../base";
import { EventType, EventUserType, TransportType } from "../types";
import { All } from "./All";

/**
 * Component that applies an info object constructor to each data item,
 * producing an information source with new values
 * https://silentium-lab.github.io/silentium/#/en/information/map
 */
export class Map<T, TG> implements EventType<TG[]> {
  public constructor(
    private $base: EventType<T[]>,
    private $target: TransportType<any[], TG>,
  ) {}

  public event(user: EventUserType<TG[]>): this {
    this.$base.event(this.parent.child(user));
    return this;
  }

  private parent = new ParentUser<T[]>((v, child) => {
    const infos: EventType<TG>[] = [];
    v.forEach((val) => {
      let valInfo: EventType<T> | T = val;
      if (!isEvent(valInfo as object)) {
        valInfo = new Of(valInfo);
      }
      const info = this.$target.of(valInfo);
      infos.push(info);
    });
    const allI = new All(...infos);
    allI.event(child);
  });
}
