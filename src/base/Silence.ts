import { isFilled } from "helpers/guards";
import { ConstructorType } from "types/ConstructorType";

/**
 * Silence is null or undefined or duplicated values
 * Everything else is not silence
 */
export function Silence<T>(resolve: ConstructorType<[T]>) {
  let lastValue: T;
  return (v: T) => {
    if (isFilled(v) && v !== lastValue) {
      lastValue = v;
      resolve(v);
    }
  };
}
