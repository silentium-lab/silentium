import { subSource } from "../Guest/PatronPool";
import { give } from "../Guest/Guest";
import { guestCast } from "../Guest/GuestCast";
import { value } from "../Source/Source";
import { SourceType } from "../types/SourceType";
import { GuestType } from "../types/GuestType";

/**
 * Gives ability to apply function to source value
 * @url https://silentium-lab.github.io/silentium/#/source/source-applied
 */
export const sourceApplied = <T, R>(
  baseSource: SourceType<T>,
  applier: (v: T) => R,
) => {
  const src = (guest: GuestType<R>) => {
    value(
      baseSource,
      guestCast(guest, (v) => {
        give(applier(v), guest);
      }),
    );
  };
  subSource(src, baseSource);

  return src;
};
