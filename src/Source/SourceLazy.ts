import { GuestType } from "src/Guest/Guest";
import { LazyType } from "../Lazy/Lazy";
import { patron } from "../Patron/Patron";
import { destroy } from "../Patron/PatronPool";
import { SourceType, value } from "../Source/Source";
import { sourceAll } from "../Source/SourceAll";
import { sourceOf } from "../Source/SourceChangeable";
import { sourceResettable } from "../Source/SourceResettable";

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
  const resultResettable = sourceResettable(result, destroySrc ?? sourceOf());
  let wasInstantiated = false;

  const instantiate = () => {
    if (wasInstantiated) {
      return;
    }

    wasInstantiated = true;
    value(
      sourceAll(args),
      patron(() => {
        if (!instance) {
          instance = lazySrc.get(...args);
          value(instance, patron(result));
        }
      }),
    );
  };

  if (destroySrc) {
    value(
      destroySrc,
      patron(() => {
        destroy(instance);
        instance = null;
      }),
    );
  }

  return (g: GuestType<T>) => {
    instantiate();
    value(resultResettable, g);
  };
};
