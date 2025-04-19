import { give, GuestType } from "../Guest/Guest";
import { SourceType, value } from "./Source";
import { PatronPool } from "../Patron/PatronPool";
import { SourceChangeableType } from "./SourceChangeable";

/**
 * @url https://silentium-lab.github.io/silentium/#/source/source-dynamic
 */
export class SourceDynamic<T = unknown> implements SourceChangeableType<T> {
  public constructor(
    private baseGuest: GuestType<T>,
    private baseSource: SourceType<T>,
  ) {
    if (baseGuest === undefined) {
      throw new Error("SourceDynamic didnt receive baseGuest argument");
    }
    if (baseSource === undefined) {
      throw new Error("SourceDynamic didnt receive baseSource argument");
    }
  }

  public value(guest: GuestType<T>) {
    value(this.baseSource, guest);
    return this;
  }

  public give(value: T) {
    give(value, this.baseGuest);
    return this;
  }

  public pool(): PatronPool<T> {
    throw Error("No pool in SourceDynamic");
  }
}
