import { give, GuestType } from "../Guest/Guest";
import { SourceType, value } from "./Source";
import { SourceChangeableType } from "./SourceChangeable";

/**
 * Ability to build common changeable source from different guest and source
 * @url https://silentium-lab.github.io/silentium/#/source/source-dynamic
 */
export const sourceDynamic = <T>(
  baseGuest: GuestType<T>,
  baseSource: SourceType<T>,
): SourceChangeableType<T> => {
  if (baseGuest === undefined) {
    throw new Error("SourceDynamic didn't receive baseGuest argument");
  }
  if (baseSource === undefined) {
    throw new Error("SourceDynamic didn't receive baseSource argument");
  }

  const sourceObject = {
    value(guest: GuestType<T>) {
      value(baseSource, guest);
      return sourceObject;
    },
    give(value: T) {
      give(value, baseGuest);
      return this;
    },
  };

  return sourceObject;
};
