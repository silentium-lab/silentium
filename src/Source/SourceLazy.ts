import { LazyType } from "../Lazy/Lazy";
import { patron } from "../Patron/Patron";
import { destroy } from "../Patron/PatronPool";
import { SourceType, value } from "../Source/Source";
import { sourceAll } from "../Source/SourceAll";
import { sourceOf } from "../Source/SourceChangeable";
import { sourceResettable } from "../Source/SourceResettable";

/**
 * Helps to build source only when all sources will give its values
 * @url https://silentium-lab.github.io/silentium/#/source/source-lazy
 */
export const sourceLazy = <T>(
  lazySrc: LazyType<SourceType<T>>,
  args: SourceType[],
  resetSrc?: SourceType<unknown>,
) => {
  let instance: SourceType<T> | null = null;
  const result = sourceOf<T>();
  const resultResettable = sourceResettable(result, resetSrc ?? sourceOf());

  value(
    sourceAll(args),
    patron(() => {
      if (!instance) {
        instance = lazySrc.get(...args);
        value(instance, patron(result));
      }
    }),
  );

  if (resetSrc) {
    value(
      resetSrc,
      patron(() => {
        destroy(instance);
        instance = null;
      }),
    );
  }

  return resultResettable;
};
