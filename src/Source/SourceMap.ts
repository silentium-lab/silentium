import { GuestType } from "../Guest/Guest";
import { GuestCast } from "../Guest/GuestCast";
import { PrivateType } from "../Private/Private";
import { SourceType, value } from "./Source";
import { sourceAll } from "./SourceAll";

/**
 * @url https://silentium-lab.github.io/silentium/#/source/source-map
 */
export const sourceMap = <T, TG>(
  baseSource: SourceType<T[]>,
  targetSource: PrivateType<SourceType<TG>>,
) => {
  if (baseSource === undefined) {
    throw new Error("SourceMap didn't receive baseSource argument");
  }
  if (targetSource === undefined) {
    throw new Error("SourceMap didn't receive targetSource argument");
  }

  return (guest: GuestType<TG[]>) => {
    value(
      baseSource,
      new GuestCast(<GuestType>guest, (theValue) => {
        const sources: SourceType[] = [];
        theValue.forEach((val) => {
          const source = targetSource.get(val);
          sources.push(source);
        });
        value(sourceAll(sources), guest);
      }),
    );
    return this;
  };
};
