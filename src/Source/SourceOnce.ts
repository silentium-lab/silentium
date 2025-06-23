import { SourceType } from "../types/SourceType";
import { destroy } from "../Guest/PatronPool";
import { sourceOf } from "./SourceChangeable";
import { GuestType } from "../types/GuestType";
import { Source, value } from "../Source/Source";
import { G } from "../Guest";

/**
 * Ability set the value only once
 * @url https://silentium-lab.github.io/silentium/#/source/source-once
 */
export const sourceOnce = <T>(initialValue?: SourceType<T>) => {
  let isFilled = initialValue !== undefined;
  const source = sourceOf(initialValue);

  return {
    value(guest: GuestType<T>) {
      value(source, guest);
      return this;
    },
    give(value: T) {
      if (!isFilled) {
        source.give(value);
        isFilled = true;
      }
      return this;
    },
    destroy() {
      destroy(source);
    },
  };
};

export const once = <T>(baseSrc: Source<T>) => {
  const src = new Source<T>((g) => {
    let isFilled = false;
    baseSrc.value(
      G((v) => {
        if (!isFilled) {
          isFilled = true;
          g.give(v);
        }
      }),
    );
  });
  src.subSource(baseSrc);

  return src;
};
