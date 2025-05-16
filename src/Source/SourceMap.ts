import { destroy, subSource } from "../Patron/PatronPool";
import { give, GuestType } from "../Guest/Guest";
import { guestCast } from "../Guest/GuestCast";
import { LazyType } from "../Lazy/Lazy";
import { SourceType, value } from "./Source";
import { sourceAll } from "./SourceAll";

/**
 * Helps to modify many sources with one private source
 * @url https://silentium-lab.github.io/silentium/#/source/source-map
 */
export const sourceMap = <T, TG>(
  baseSource: SourceType<T[]>,
  targetSource: LazyType<SourceType<TG>>,
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
      guestCast(<GuestType>guest, (theValue) => {
        const sources: SourceType[] = [];
        theValue.forEach((val) => {
          const source = targetSource.get(val);
          subSource(source, baseSource);
          sources.push(source);
        });
        value(
          sourceAll(sources),
          guestCast(guest, (v) => {
            destroy(sources);
            give(v, guest);
          }),
        );
      }),
    );
    return this;
  };
};
