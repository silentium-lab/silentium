import { SourceExecutorType, SourceType, value } from "../Source/Source";

/**
 * Ability to apply function to source executor, helpful when need to apply throttling or debounce
 * @url https://silentium-lab.github.io/silentium/#/source/source-executor-applied
 */
export const sourceExecutorApplied = <T>(
  source: SourceType<T>,
  applier: (executor: SourceExecutorType<T>) => SourceExecutorType<T>,
) => {
  return applier((g) => {
    value(source, g);
  });
};
