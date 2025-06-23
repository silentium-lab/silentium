import { give, Guest } from "../Guest/Guest";
import { guestCast } from "../Guest/GuestCast";
import { Source, value } from "../Source/Source";
import { GuestType } from "../types/GuestType";
import { SourceType } from "../types/SourceType";

/**
 * Ability to apply function to source executor, helpful when need to apply throttling or debounce
 * @url https://silentium-lab.github.io/silentium/#/source/source-executor-applied
 * @deprecated will be removed
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

export const executorApplied = <T>(
  source: Source<T>,
  applier: (executor: Guest<T>) => Guest<T>,
) => {
  const src = new Source<T>((g) => {
    source.value(applier(g));
  });
  src.subSource(source);

  return src;
};
