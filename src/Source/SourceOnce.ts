import { SourceType } from "../types/SourceType";
import { destroy } from "../Guest/PatronPool";
import { sourceOf } from "./SourceChangeable";
import { GuestType } from "../types/GuestType";
import { value } from "../Source/Source";

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
