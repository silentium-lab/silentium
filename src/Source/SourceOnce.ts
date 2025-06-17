import { destroy } from "../Patron/PatronPool";
import { GuestType } from "../Guest/Guest";
import { SourceType, value } from "./Source";
import { sourceOf } from "./SourceChangeable";

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
