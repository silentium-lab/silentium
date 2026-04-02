import { Actual } from "base/Actual";
import { Primitive } from "components/Primitive";
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
  const $base = Actual(base);
  return {
    use(value: unknown, cb: (v: unknown) => unknown) {
      const baseValue = Primitive($base);
      const lastValue = baseValue.primitive();
      if (lastValue === null) {
        cb(value);
        return;
      }
      if (lastValue !== value) {
        cb(value);
        return;
      }
      return;
    },
  };
}
