import { give, GuestType } from "../Guest/Guest";
import { GuestCast } from "../Guest/GuestCast";
import { SourceObjectType, SourceType, value } from "../Source/Source";

/**
 * @url https://silentium-lab.github.io/silentium/#/source/source-filtered
 */
export class SourceFiltered<T> implements SourceObjectType<T> {
  public constructor(
    private baseSource: SourceType<T>,
    private predicate: (v: T) => boolean,
  ) {}

  public value(g: GuestType<T>) {
    value(
      this.baseSource,
      new GuestCast(g, (v) => {
        if (this.predicate(v) === true) {
          give(v, g);
        }
      }),
    );
    return this;
  }
}
