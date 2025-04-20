import { GuestType } from "../Guest/Guest";
import { GuestCast } from "../Guest/GuestCast";
import { PrivateType } from "../Private/Private";
import { SourceObjectType, SourceType, value } from "./Source";
import { sourceAll } from "./SourceAll";

/**
 * @url https://silentium-lab.github.io/silentium/#/source/source-map
 */
export class SourceMap<T, TG> implements SourceObjectType<TG[]> {
  public constructor(
    private baseSource: SourceType<T[]>,
    private targetSource: PrivateType<SourceType<TG>>,
  ) {
    if (baseSource === undefined) {
      throw new Error("SourceMap didn't receive baseSource argument");
    }
    if (targetSource === undefined) {
      throw new Error("SourceMap didn't receive targetSource argument");
    }
  }

  public value(guest: GuestType<TG[]>) {
    value(
      this.baseSource,
      new GuestCast(<GuestType>guest, (theValue) => {
        const sources: SourceType[] = [];
        theValue.forEach((val) => {
          const targetSource = this.targetSource.get(val);
          sources.push(targetSource);
        });
        value(sourceAll(sources), guest);
      }),
    );
    return this;
  }
}
