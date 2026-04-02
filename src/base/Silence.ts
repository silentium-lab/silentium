import { isFilled } from "helpers/guards";
import { ConstructorType } from "types/ConstructorType";
import { MaybeMessage } from "types/MessageType";

export const ResetSilenceCache = Symbol("reset-silence-cache");

/**
 * Silence is null or undefined
 * Everything else is not silence
 *
 * @url https://silentium.pw/article/silence/view
 */
export function Silence<T>(resolve: ConstructorType<[T]>) {
  let lastValue: T | undefined;
  return function SilenceImpl(v: T | undefined) {
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

/**
 * Silence rule when new value comes
 */
export function SilenceUse(base: MaybeMessage) {
  let lastValue: unknown = null;
  return {
    use(value: unknown, cb: (v: unknown) => unknown) {
      if (lastValue === null) {
        lastValue = value;
        cb(value);
        return;
      }
      if (lastValue !== value) {
        lastValue = value;
        cb(value);
        return;
      }
      lastValue = value;
      return;
    },
  };
}
