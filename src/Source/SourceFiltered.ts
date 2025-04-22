import { give, GuestType } from "../Guest/Guest";
import { GuestCast } from "../Guest/GuestCast";
import { SourceType, value } from "../Source/Source";

/**
 * Helps not to respond with information what checked by predicate function
 * @url https://silentium-lab.github.io/silentium/#/source/source-filtered
 */
export const sourceFiltered = <T>(
  baseSource: SourceType<T>,
  predicate: (v: T) => boolean,
) => {
  return (g: GuestType<T>) => {
    value(
      baseSource,
      new GuestCast(g, (v) => {
        if (predicate(v) === true) {
          give(v, g);
        }
      }),
    );
  };
};
