import { I, Information } from "../Information";
import { O } from "../Owner";

/**
 * A component that takes one value at a time and returns an array
 * https://silentium-lab.github.io/silentium/#/en/information/sequence
 */
export const sequence = <T>(base: Information<T>): Information<T[]> => {
  const i = I<T[]>((o) => {
    const result: T[] = [];

    base.value(
      O((v) => {
        result.push(v);
        o.give(result);
      }),
    );
  });
  i.subInfo(base);

  return i;
};
