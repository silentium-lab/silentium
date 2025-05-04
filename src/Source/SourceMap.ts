import { subSource } from "src/Patron/PatronPool";
import { GuestType } from "../Guest/Guest";
import { guestCast } from "../Guest/GuestCast";
import { PersonalType } from "../Personal/Personal";
import { SourceType, value } from "./Source";
import { sourceAll } from "./SourceAll";

/**
 * Helps to modify many sources with one private source
 * @url https://silentium-lab.github.io/silentium/#/source/source-map
 */
export const sourceMap = <T, TG>(
  baseSource: SourceType<T[]>,
  targetSource: PersonalType<SourceType<TG>>,
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
        value(sourceAll(sources), guest);
      }),
    );
    return this;
  };
};
