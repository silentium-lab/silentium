import { SourceType } from "../types/SourceType";
import { G, give } from "../Guest/Guest";
import { guestCast } from "../Guest/GuestCast";
import { Source, value } from "../Source/Source";
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

export const filtered = <T>(
  baseSource: Source<T>,
  predicate: (v: T) => boolean,
  defaultValue?: T,
) => {
  return new Source<T>((g) => {
    baseSource.value(
      G((v) => {
        if (predicate(v)) {
          g.give(v);
        } else if (defaultValue !== undefined) {
          g.give(defaultValue);
        }
      }),
    );
  }).subSource(baseSource);
};
