import { SourceType } from "../types/SourceType";
import { give } from "../Guest/Guest";
import { guestCast } from "../Guest/GuestCast";
import { value } from "../Source/Source";
import { GuestType } from "../types/GuestType";

/**
 * Ability to apply function to source executor, helpful when need to apply throttling or debounce
 * @url https://silentium-lab.github.io/silentium/#/source/source-executor-applied
 */
export const sourceExecutorApplied = <T>(
  source: SourceType<T>,
  applier: (executor: GuestType<T>) => GuestType<T>,
) => {
  return (g: GuestType<T>) => {
    value(
      source,
      guestCast(
        g,
        applier((v) => {
          give(v, g);
        }),
      ),
    );
  };
};
