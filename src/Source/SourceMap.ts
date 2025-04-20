import { GuestType } from "../Guest/Guest";
import { GuestCast } from "../Guest/GuestCast";
import { PrivateType } from "../Private/Private";
import { SourceObjectType, SourceType, value } from "./Source";
import { SourceAll } from "./SourceAll";

/**
 * @url https://silentium-lab.github.io/silentium/#/source/source-map
 */
export class SourceMap<T, TG> implements SourceObjectType<TG[]> {
  public constructor(
    private baseSource: SourceType<T[]>,
    private targetSource: PrivateType<SourceType<TG>>,
  ) {
    if (baseSource === undefined) {
      throw new Error("SourceMap didnt receive baseSource argument");
    }
    if (targetSource === undefined) {
      throw new Error("SourceMap didnt receive targetSource argument");
    }
  }

  public value(guest: GuestType<TG[]>) {
    const all = new SourceAll();
    value(
      this.baseSource,
      new GuestCast(<GuestType>guest, (theValue) => {
        theValue.forEach((val, index) => {
          const targetSource = this.targetSource.get(val);
          value(targetSource, all.guestKey(index.toString()));
        });
      }),
    );
    all.valueArray(<GuestType>guest);
    return this;
  }
}
