import { SourceType } from "../types/SourceType";
import { give } from "../Guest/Guest";
import { guestCast } from "../Guest/GuestCast";
import { value } from "../Source/Source";
import { GuestType } from "../types/GuestType";

/**
 * Helps not to respond with information what checked by predicate function
 * @url https://silentium-lab.github.io/silentium/#/source/source-filtered
 */
export const sourceFiltered = <T>(
  baseSource: SourceType<T>,
  predicate: (v: T) => boolean,
  defaultValue?: T,
) => {
  return (g: GuestType<T>) => {
    value(
      baseSource,
      guestCast(g, (v) => {
        if (predicate(v) === true) {
          give(v, g);
        } else if (defaultValue !== undefined) {
          give(defaultValue, g);
        }
      }),
    );
  };
};
