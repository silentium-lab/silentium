import { give, GuestType } from "../Guest/Guest";
import { guestCast } from "../Guest/GuestCast";
import { SourceType, value } from "../Source/Source";

/**
 * Gives ability to apply function to source value
 * @url https://silentium-lab.github.io/silentium/#/source/source-applied
 */
export const sourceApplied = <T, R>(
  baseSource: SourceType<T>,
  applier: (v: T) => R,
) => {
  return (guest: GuestType<R>) => {
    value(
      baseSource,
      guestCast(guest, (v) => {
        give(applier(v), guest);
      }),
    );
  };
};
