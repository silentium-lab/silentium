import { isFilled } from "helpers/guards";
import { ConstructorType } from "types/ConstructorType";

export const ResetSilenceCache = Symbol("reset-silence-cache");

export interface IdentifiedType {
  identityKey(): string;
}

/**
 * Silence is null or undefined
 * Everything else is not silence
 *
 * @url https://silentium.pw/article/silence/view
 */
export function Silence<T>(resolve: ConstructorType<[T]>) {
  let lastValue: T | undefined;
  return function SilenceImpl(value: T | undefined) {
    if (value === ResetSilenceCache) {
      lastValue = undefined;
      value = undefined;
    }
    if (isFilled(value) && value !== lastValue) {
      if (
        isIdentified(lastValue) &&
        isIdentified(value) &&
        value.identityKey() === lastValue.identityKey()
      ) {
        return;
      }
      lastValue = value;
      resolve(value);
    }
  };
}

/**
 * Silence rule when new value comes
 */
export function SilenceUse() {
  let lastValue: unknown = null;
  return {
    use(value: unknown, cb: (v: unknown) => unknown) {
      if (lastValue === null) {
        lastValue = value;
        cb(value);
        return;
      }
      if (lastValue !== value) {
        if (
          isIdentified(lastValue) &&
          isIdentified(value) &&
          value.identityKey() === lastValue.identityKey()
        ) {
          return;
        }
        lastValue = value;
        cb(value);
        return;
      }
      lastValue = value;
      return;
    },
  };
}

export function isIdentified(obj: unknown): obj is IdentifiedType {
  return (
    obj !== null &&
    typeof obj === "object" &&
    "identityKey" in obj &&
    typeof obj.identityKey === "function"
  );
}
