import { isFilled } from "helpers/guards";
import { ConstructorType } from "types/ConstructorType";

export const ResetSilenceCache = Symbol("reset-silence-cache");

/**
 * Silence is null or undefined or duplicated values
 * Everything else is not silence
 *
 * @url https://silentium.pw/article/silence/view
 */
export function Silence<T>(resolve: ConstructorType<[T]>) {
  let lastValue: T | undefined;
  return (v: T | undefined) => {
    if (v === ResetSilenceCache) {
      lastValue = undefined;
      v = undefined;
    }
    if (isFilled(v) && v !== lastValue) {
      lastValue = v;
      resolve(v);
    }
  };
}
