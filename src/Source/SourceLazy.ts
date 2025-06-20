import { LazyType } from "../types/LazyType";
import { systemPatron } from "../Guest/Patron";
import { destroy, subSource } from "../Guest/PatronPool";
import { value } from "../Source/Source";
import { sourceAll } from "../Source/SourceAll";
import { sourceOf } from "../Source/SourceChangeable";
import { sourceResettable } from "../Source/SourceResettable";
import { SourceType } from "../types/SourceType";
import { GuestType } from "../types/GuestType";

/**
 * Helps to build source only when all sources will give its values
 * and only after some guest visit source
 * @url https://silentium-lab.github.io/silentium/#/source/source-lazy
 */
export const sourceLazy = <T>(
  lazySrc: LazyType<SourceType<T>>,
  args: SourceType[],
  destroySrc?: SourceType<unknown>,
) => {
  let instance: SourceType<T> | null = null;
  const result = sourceOf<T>();
  const resultResettable = sourceResettable<T>(
    result,
    destroySrc ?? sourceOf(),
  );
  let wasInstantiated = false;

  const instantiate = (srcInstance: SourceType<T>) => {
    if (wasInstantiated) {
      return;
    }

    wasInstantiated = true;
    value(
      sourceAll(args),
      systemPatron(() => {
        if (!instance) {
          instance = lazySrc.get(...args);
          value(instance, systemPatron(result));
          subSource(result, srcInstance);
          subSource(resultResettable, srcInstance);
        }
      }),
    );
  };

  if (destroySrc) {
    value(
      destroySrc,
      systemPatron(() => {
        destroy(instance);
        instance = null;
      }),
    );
  }

  const src = (g: GuestType<T>) => {
    instantiate(src);
    value(resultResettable, g);
  };

  return src;
};
